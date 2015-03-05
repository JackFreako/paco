//
//  ViewController.m
//  PacoTest
//
//  Created by Ian Spiro on 12/29/14.
//  Copyright (c) 2014 Ian Spiro. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()
@property (strong, nonatomic) IBOutlet UIWebView *webview;

@end

@implementation ViewController

- (void)viewDidLoad
{
  [super viewDidLoad];
  // Do any additional setup after loading the view, typically from a nib.
  
  //load url into webview
//  NSString *strURL = @"https://www.google.com";
//  NSURL *url = [NSURL URLWithString:strURL];
//  NSURLRequest *urlRequest = [NSURLRequest requestWithURL:url];
//  [self.webview loadRequest:urlRequest];
//  
//  NSString *htmlFile = [[NSBundle mainBundle] pathForResource:@"vulcanized-bloat" ofType:@"html"];
//  NSString* htmlString = [NSString stringWithContentsOfFile:htmlFile encoding:NSUTF8StringEncoding error:nil];
//  [self.webview loadHTMLString:htmlString baseURL:nil];
  
  
  NSBundle *mainBundle = [NSBundle mainBundle];
  NSURL *indexUrl = [mainBundle URLForResource:@"index" withExtension:@"html"];
  
  // The magic is loading a request, *not* using loadHTMLString:baseURL:
  NSURLRequest *urlReq = [NSURLRequest requestWithURL:indexUrl];
  [self.webview loadRequest:urlReq];
}


- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

@end
