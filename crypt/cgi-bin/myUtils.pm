#!/usr/bin/perl -w
package myUtils;  # Freeq used utilities
require 5.004;
require Exporter;
use CGI qw(:standard);
@ISA = qw(Exporter);
@EXPORT = qw(readfile myHeader myFooter IsPostBack);
# @EXPORT_OK = qw(DOCROOT);
#-------------------------------------------------------------------------------
#
#-------------------------------------------------------------------------------
use strict;
use CGI qw(:standard);
my $DOCROOT = "..";				  # also defined in myUtils.pm
my $FOOTER="";
my $HEADER="";
my %files;
1;

sub readfile(@)
{
	my($file) = @_;
	return $files{$file} if ($files{$file});

	die("'$file' not found?\n") unless open(FILE,"$file");
   my $buff = "";
	while (<FILE>) 
	{
		$buff .= $_;
	}
   close(FILE);
	$files{$file} = $buff;
	$buff;
}
#-------------------------------------------------------------------------------
sub myHeader(@)
{
	$HEADER = (readfile("html/top.html") || ".") unless $HEADER;
	print header(@_);
	print $HEADER;
}
#-------------------------------------------------------------------------------
sub myFooter()
{
	$FOOTER = (readfile("html/bottom.html") || ".\n") unless $FOOTER;
	print $FOOTER;
}
#-------------------------------------------------------------------------------
sub IsPostBack()
{
	my $ref = referer() || "Undefined";
	my $url = url() || "Undefined";
	return ( $ref && $url && $ref eq $url);
}
