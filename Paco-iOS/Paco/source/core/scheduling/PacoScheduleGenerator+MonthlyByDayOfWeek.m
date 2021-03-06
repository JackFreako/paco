/* Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import "PacoScheduleGenerator+MonthlyByDayOfWeek.h"
#import "PacoScheduleGenerator.h"
#import "PacoExperiment.h"
#import "PacoExperimentSchedule.h"
#import "PacoDateUtility.h"
#import "NSDate+Paco.h"
#import "NSCalendar+Paco.h"

@implementation PacoScheduleGenerator (MonthlyByDayOfWeek)

+ (NSArray*)nextDatesByDayOfWeekForExperiment:(PacoExperiment*)experiment
                                   numOfDates:(int)numOfDates
                                     fromDate:(NSDate*)fromDate {
  NSDate* adjustedGenerateTime = [self adjustedGenerateTime:fromDate forExperiment:experiment];
  NSDate* monthToSchedule = [self firstMonthAbleToScheduleByDayOfWeekExperiment:experiment
                                                                   generateTime:adjustedGenerateTime];

  int numOfDatesNeeded = numOfDates;
  NSMutableArray* results = [NSMutableArray arrayWithCapacity:numOfDates];
  while (numOfDatesNeeded > 0) {
    NSArray* dates = [self datesForMonth:monthToSchedule
                   byDayOfWeekExperiment:experiment
                            generateTime:adjustedGenerateTime];
    int numOfCurrentDates = (int)[dates count];
    if (0 == numOfCurrentDates) {
      break;
    }
    int numOfDatesToAdd = (numOfCurrentDates > numOfDatesNeeded) ? numOfDatesNeeded : numOfCurrentDates;
    NSIndexSet* indexSet = [NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, numOfDatesToAdd)];
    [results addObjectsFromArray:[dates objectsAtIndexes:indexSet]];
    
    numOfDatesNeeded -= numOfDatesToAdd;
    monthToSchedule = [monthToSchedule pacoDateByAddingMonthInterval:experiment.schedule.repeatRate];
  }
  return ([results count] > 0) ? results : nil;
}


+ (NSDate*)firstMonthAbleToScheduleByDayOfWeekExperiment:(PacoExperiment*)experiment
                                            generateTime:(NSDate*)generateTime {
  NSDate* exeprimentStartDateMidnight = [experiment isFixedLength] ? [experiment startDate] : [experiment joinDate];
  NSInteger numOfMonthsUntilGenerateTime = [[NSCalendar pacoGregorianCalendar] pacoMonthsFromDate:exeprimentStartDateMidnight
                                                                                     toDate:generateTime];
  NSInteger repeatRate = experiment.schedule.repeatRate;
  NSInteger repeatTimes = numOfMonthsUntilGenerateTime / repeatRate;
  NSInteger extraMonths = numOfMonthsUntilGenerateTime % repeatRate;
  BOOL isCurrentMonthActive = (0 == extraMonths);
  if (isCurrentMonthActive &&
      [self isMonthlyByDayOfWeekExperiment:experiment ableToGenerateSince:generateTime]) {
    return [generateTime pacoFirstDayInCurrentMonth];
  }
  
  repeatTimes++;
  NSInteger months = repeatTimes * repeatRate;
  NSDate* monthToSchedule = [[exeprimentStartDateMidnight pacoFirstDayInCurrentMonth] pacoDateByAddingMonthInterval:months];
  if ([experiment isFixedLength] && [monthToSchedule pacoNoEarlierThanDate:[experiment endDate]]) {
    monthToSchedule = nil;
  }
  return monthToSchedule;
}


+ (BOOL)isMonthlyByDayOfWeekExperiment:(PacoExperiment*)experiment ableToGenerateSince:(NSDate*)generateTime {
  NSDate* monthToSchedule = [generateTime pacoFirstDayInCurrentMonth];
  NSArray* dates = [self datesForMonth:monthToSchedule byDayOfWeekExperiment:experiment generateTime:generateTime];
  return [dates count] > 0;
}


+ (NSArray*)datesForMonth:(NSDate*)monthToSchedule
    byDayOfWeekExperiment:(PacoExperiment*)experiment
             generateTime:(NSDate*)generateTime {
  if (!monthToSchedule) {
    return nil;
  }
  NSInteger weekIndex = experiment.schedule.nthOfMonth; //0 based
  NSInteger dayIndex = weekIndex * kPacoNumOfDaysInWeek;
  NSDate* firstDayInWeek = [monthToSchedule pacoDateByAddingDayInterval:dayIndex];
  for (int interval = 0; interval < kPacoNumOfDaysInWeek; interval++) {
    NSDate* day = [firstDayInWeek pacoDateByAddingDayInterval:interval];
    if (![day pacoInSameMonthWith:firstDayInWeek]) {
      break;
    }
    int indexInWeek = [day pacoIndexInWeek];
    if (indexInWeek == [experiment.schedule dayIndexByDayOfWeek]) {
      NSArray* results = [day pacoDatesToScheduleWithTimes:experiment.schedule.times
                                              generateTime:generateTime
                                                andEndDate:[experiment endDate]];
      return [results count] > 0 ? results : nil;
    }
  }
  return nil;
}


@end
