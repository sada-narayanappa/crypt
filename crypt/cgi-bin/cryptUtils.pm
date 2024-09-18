#!/usr/bin/perl -w
package cryptUtils;  # Freeq used utilities
require 5.004;
require Exporter;
use CGI qw(:standard);
@ISA = qw(Exporter);
@EXPORT = qw(IsPrime Factor NextPrime);
#-------------------------------------------------------------------------------
use strict;
use CGI qw(:standard);
#-------------------------------------------------------------------------------
sub IsPrime(@)
{
   my ($input,$pr_steps) = @_;
   $input % $_ or return 0 for ( 2 .. sqrt($input) );
   print " $input  is prime\n" if ($pr_steps);
   1
}
#-------------------------------------------------------------------------------
sub NextPrime(@)
{
	my($cur) = @_;
	$cur++;
	while (!IsPrime($cur)) { $cur++; }
	$cur;
}
#-------------------------------------------------------------------------------
sub Factor(@)
{
	my($num, $pr_steps) = @_;
	my @ret;
	my $cur = 2;
	my $curp = 2;
	while ( !IsPrime($num))
	{
		print "trying with $cur ($curp) for $num ==>" if ($pr_steps);
		my $pow = 0;
		while( $num && ($num % $cur) == 0 )
		{
			$pow++;
			$curp = $curp * $cur;
			$num = $num / $cur;
		}
		print "  GOT $pow $num\n" if ($pr_steps);
		push(@ret, $cur) if  $pow;
		push(@ret, $pow) if  $pow;
		$cur = NextPrime($cur);
		$curp = $cur;
	}
	push(@ret, $num) if ($num > 1);
	push(@ret, 1) if ($num > 1);

	# Convert to string
	my $i = 0;
	my $str = " ";
	foreach my $t (@ret)
	{
		$str .= ($i++ % 2 == 0) ? "$t^" : "$t ";
	}
	($str, @ret);
}
