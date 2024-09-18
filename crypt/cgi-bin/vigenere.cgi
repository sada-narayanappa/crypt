#!/usr/bin/perl -w
use strict;
use myUtils;
use CGI qw(:standard);
use CGI::Carp;
#-------------------------------------------------------------------------------
# prototypes
sub VigenereAnalyze(@);
sub ExtendedEuclidean1(@);
sub GCDs(@);
sub main();
my $opt_v = 0;
my $opt_d = 0;
my $log = "";
my $opt_verb = 1;
my $opt_debug = 1;
my $dec = "";
my %PROB_DIST_TABLE = 
(
 "A"=> 0.082, "B"=> 0.015, "C"=> 0.028, "D"=> 0.043, "E"=> 0.127, "F"=> 0.022,
 "G"=> 0.020, "H"=> 0.061, "I"=> 0.070, "J"=> 0.002, "K"=> 0.008, "L"=> 0.040,
 "M"=> 0.024, "N"=> 0.067, "O"=> 0.075, "P"=> 0.019, "Q"=> 0.001, "R"=> 0.060,
 "S"=> 0.063, "T"=> 0.091, "U"=> 0.028, "V"=> 0.010, "W"=> 0.023, "X"=> 0.001,
 "Y"=> 0.020, "Z"=> 0.001
);
#-------------------------------------------------------------------------------
main();
my $DOCROOT="html";
#-------------------------------------------------------------------------------
sub main()
{
	myHeader();
	doget("../vigenere1.html");
	myFooter();
}
#-------------------------------------------------------------------------------
sub doget()
{
	my ($file) = @_;
	my $resp  = new CGI;
	my $buff = readfile($file);
 	if( param() )
	{
 		my $t1 = $resp->param("t1");
 		my $kl = $resp->param("keylen");
 		my $k  = $resp->param("key");
		$t1 =~ s/\n//g;
		$t1 =~ s/\r//g;
		$t1 =~ s/ //g;
		$t1 =~ tr/a-z/A-Z/;
# 		my $t1 = "CHREEVOAHMAERATBIAXXWTNXBEEOPHBSBQMQEQERBWRVXUOAKXAOSXXWEAHBWGJMMQMNKGRFVGXWTRZXWIAKLXFPSKAUTEMNDCMGTSXMXBTUIADNGMGPSRELXNJELXVRVPRTULHDNQWTWDTYGBPHXTFALJHASVBFXNGLLCHRZBWELEKMSJIKNBHWRJGNMGJSGLXFEYPHAGNRBIEQJTAMRVLCRREMNDGLXRRIMGNSNRWCHRQHAEYEVTAQEBBIPEEWEVKAKOEWADREMXMTBHHCHRTKDNVRZCHRCLQOHPWQAIIWXNRMGWOIIFKEE";
		$buff =~ s/\$TEXT_TO_ANALYZE\$/$t1/;
		$buff =~ s/\$KEY_LENGTH\$/$kl/;
		$buff =~ s/\$KEY\$/$k/;

		Log("Starting Analyisis \n" . $t1 . "\n");
		VigenereAnalyze($t1, $kl, $k) if $t1;
		$log =~ s/\n/<br>\n/g;
		$buff =~ s/<MESSAGE>/$log <br><b> $dec/;
	}
	else
	{
		$buff =~ s/\$.*?\$//g;
	}
 	print "$buff\n";
# 	print $log;
}
#-------------------------------------------------------------------------------
#
#
#
#-------------------------------------------------------------------------------
# Utilities used by VigenereAnalyze()
#
#-------------------------------------------------------------------------------
# suppose key = [XYZ] m = 3
#               |         |         |         |
# $p = 123456789012345678901234567890123456789012
#      XYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZ
# random          ^--------------^ <d=(p2-p1)%m= 27-12 = 15 % 3 = 0
# d = 0 they both are encypted with same key
#
# Does kasiski's stuff here for i=2 about 10 should be a lot 
#-------------------------------------------------------------------------------
sub Kasiski(@)
{
   my($buff, $min, $max) = @_;
   my $buffc = $buff;           # make a copy of buffer
   $min = 2 unless $min;        # set default value if max is not given
   $max = $min unless $max || $max < $min; # set default if max is not given

   Log("<~~~~~~~~~~~~~~~~In Kasiski's Test\n") if $opt_verb;

   my %possible_key_len;
   for ( ; $min <= $max; $min++)
   {
      Log( "\t[Kasiski] Trying with patterns of $min...\n") if $opt_verb;
      my $i = 0;
      for( my $i=0, my $l=0; $i < length($buff)/2; $i++)
      {
         my $pat = substr($buff, $i, $min);
         my $cnt = $i;          # start with 0
         my @pats= ();
         #pick up all matched patterns into an array
         do
         {
            $cnt = index($buff,$pat,$cnt);
            push(@pats, $cnt+1) if ($cnt >=0 );
            $cnt++;
         }while($cnt > 0);
         $cnt = @pats;
         #Determine their positional differences and find GCDs
         my @pats_diff = ();
         if ( $cnt > 2 )
         {
            Log("Found ['$pat'] occurs $cnt, at (@pats)\n") if ($opt_verb);
            for (my $k=0; $k < $cnt - 1; $k++)
            {
               push(@pats_diff , $pats[$k+1] - $pats[0]);
            }
            Log("Delta(x) b/w these patterns (@pats_diff)\n") if $opt_verb; 
            GCDs(\@pats_diff, \%possible_key_len);
         }
      }
   }
   #
   #Here we will print all possible key length this algorthm found
   #
   my @ps = sort { $a <=> $b } (keys %possible_key_len);
   Log( "Possible key lengths [@ps] \n") if $opt_verb;
   my %best_guess;
   foreach my $tmp(@ps)
   {
      ($best_guess{$tmp}+=1) || ($best_guess{$tmp}=1) if($tmp != 1);
   }
   my %best_guess1;                # invert values to keys 

   foreach my $tmp( keys %best_guess)
   {
      my $v = $best_guess{$tmp};
      $best_guess1{$v}= $tmp unless $best_guess1{$v}; # take lowest denomination
   }
   my @klen = sort keys %best_guess1;
   my $len = @klen;
   my $bg= 5;                   # return default of 5
   if ( $len > 0 )
   {
      $bg = $best_guess1{$klen[$#klen]};
   }
   $bg;
}
#-------------------------------------------------------------------------------
# Index of coincidence, take a buffer and $m construct matrices and
# computer index-of-coincident from the tables above
# return list of values found 
#
# algorithmn is same as given in the text, here is birds view
# split buffer into $m x (n/m)  matrix and for each row computer IC
#
# I like making cols here than what in ass4.pl, references rule :-)
#
#-------------------------------------------------------------------------------
sub IC(@)
{
   my ($buff,$m)= @_;

   Log("<~~~~~~~~~~~~~~~~In Index of coincidence test\n") if $opt_verb;
   my @cols = ();

   # Initialize @cols with local ref!! yes, once ref'd, it stays until unref'd
   for(my $i=0; $i < $m ; $i++)
   {
      my $c;
      push (@cols, \$c);
   }
   for( my $i=0; $i< length($buff); $i += $m )
   {
      for( my $k=0; $k< $m; $k++)
      {
         my $tmp = $i + $k;
         my $c   = $cols[$k];
         $$c .= substr($buff, $tmp, 1) if $tmp < length($buff);
      }
   }
   #
   # Now compute Ic(x) on each of strings
   #
   my @ICs=();
   for(my $i=0; $i < $m ; $i++)
   {
      my $c   = $cols[$i];
      my %c;
      # count occurance of each character in subtext
      foreach my $tmp (split //, $$c )
      {
         ($c{$tmp}++) || ($c{$tmp}=1);
      }
      my $icl=0;
      my $len=length($$c);
      foreach my $tmp (keys %c )
      {
         my $ct = $c{$tmp};
         $icl += ($ct * ($ct -1))/ ($len * ($len-1));
      }
      $icl = sprintf("%.4f", $icl);
      push(@ICs, $icl);
		Log("$i) $$c <==IC=$icl\n") if $opt_debug;
   }
   Log("ICs m=$m (@ICs)\n") if $opt_verb;
   (\@ICs, \@cols)
}
#-------------------------------------------------------------------------------
# Mutual Index of coincidence, take a cols of text and $m 
# construct matrix of different shifts 
#
# algorithmn is same as given in the book and class, here is birds view
# for each buffer in $cols, compute freeq and computer Mg from the 
# table $PROB_DIST_TABLE given above
#
# We can make this efficient by have hash of hashes, but to be clear about 
# what I am doing, I will just repeat steps
#
# return best guessed array
#
#-------------------------------------------------------------------------------
sub MIC(@)
{
   my ($cols, $m)= @_;

   Log("<~~~~~~~~~~~~~~~~In MUTUAL INDEX OF COINCIDENCE\n") if $opt_verb;

   my @best_guess;
   my @best_guess_vals;
   for(my $i=0; $i < $m ; $i++)
   {
      push (@best_guess, 0);
      push (@best_guess_vals, 'A');
   }
   # Some intialization, I am sure this could be done better in perl
   my @std_prob_dist_vals = ();
   my @std_prob_dist_keys = sort keys %PROB_DIST_TABLE;
   foreach my $tmp( @std_prob_dist_keys)
   {
      push(@std_prob_dist_vals, $PROB_DIST_TABLE{$tmp});
   }

   #
   # Now compute Ic(x) on each of strings
   #
   for(my $i=0; $i < $m ; $i++)
   {
      my %cnt;                     # initialize cnt, is hash of freeq counts
      foreach my $k( @std_prob_dist_keys )
      {
         $cnt{$k} = 0;
      }

      my $c   = $$cols[$i];
      # count occurance of each character in subtext
      foreach my $tmp (split //, $$c )
      {
         ($cnt{$tmp}++);
      }
      # Make an array of Freeq. counts suitable for accessing for our case
      my @mgv= ();
      foreach my $mgk(sort  keys %cnt)
      {
         push(@mgv, $cnt{$mgk});
      }
      # compute Mg i.e M0, M1, ......M25 here
      my @Mgs = ();
      my $len=length($$c);
      for (my $g=0 ; $g < 25; $g++ )
      {
         my $Mg=0;
         for (my $l=0 ; $l < $#mgv; $l++ )
         {
            my $ct = $mgv[ ($l + $g) % 26 ];
            $Mg += $std_prob_dist_vals[$l] * $ct/ $len;
         }                      # END of computing one Mg
         $Mg = sprintf("%.3f", $Mg);
         if ( $Mg > 0.050 && $Mg < 0.075 )
         {
				push(@Mgs, chr(ord('A') + $g) . " >$i=[$Mg]<");
			}
			else
         {
				push(@Mgs, $Mg);
			}

         # See if this is good guess , adjust to fine tune care about 
			# don;t check do it anyways
#          if ( $Mg > 0.015 && $Mg < 0.095 )
         {
            my $ab = $best_guess[$i];
            if ( $ab != 0 )
            {                   #see if this guess better than one picked.!
               my $a1 = abs( 0.065 - $ab );
               my $a2 = abs( 0.065 - $Mg );
               if ( $a1 > $a2 )
               {                # current guess is better
                  $best_guess[$i] = $Mg;
                  $best_guess_vals[$i] = chr(ord('A') + $g);
               }
               #else old guess was good 
            }
            else
            {
               $best_guess[$i] = $Mg;
               $best_guess_vals[$i] = chr(ord('A') + $g);
            }
         }
      }                         # End of computing all Mgs
      Log("$i) @Mgs\n_______________________\n") if $opt_verb;
   }                            # END of main for loop, for all subtexts
   Log( "GUESS: @best_guess_vals based on (@best_guess) \n") if $opt_verb;
   @best_guess_vals
}
#-------------------------------------------------------------------------------
#
# This is from assignment 2, given a key and P returns text decrypted
# Changes: Old one in ass2 Expected key in numeric format ...sigh
# Here I changed it so we can pass in text
#
#-------------------------------------------------------------------------------
sub Vigenere(@)
{
   my($p , @key_str ) = @_;
   my $len = @key_str;
   Log("<~~~~~~~~~~~~~~~~IN Vigenere \n") if $opt_verb;
   Log(" Key given = (@key_str) len=",$#key_str+1, "\n") if $opt_verb;

   my @key;
   my @keyi;                    # also compute key inverse, just in case,
   foreach  my $p1(@key_str )
   {
      $p1 =~ tr/a-z/A-Z/;       # No need for this, I wonder what happens if 
      $p1 = ord($p1) - ord('A'); # key used is lower case. I guess it shouldn't
      push(@key,$p1);           #  matter, cause actual key is just a number
      push(@keyi, (26-$p1) % 26);
   }

   Log(" Using key Key=(@key):-)\n") if $opt_verb;
   my ($pos, $c) = (0, "");

   foreach  my $p1 (split //,$p )
   {
      my $realP = $p1;             # convert to upper case first
      $realP =~ tr/a-z/A-Z/;
      $realP = ord($realP) - ord('A');

      if ($realP < 0 || $realP >= 26)
      {
         $c .= $p1;
      }
      else
      {
         my $tmp = ($realP + $keyi[$pos % $len ]) % 26;
         $c .= chr( ord('A') + $tmp);
         $pos++;
      }
   }
	$dec = $c;
   Log("$c\n~~~~~~~~~~~~~~~~~~~~~\n"); # if $opt_verb;  <== print this anyways
   $c;
}
#-------------------------------------------------------------------------------
# This function does all the job 
#
#
#-------------------------------------------------------------------------------
sub VigenereAnalyze(@)
{
   my($buff, $m1, $key, $m,$n) = @_;
   $m = 3  unless $m;           # set default values if not given
   $n = $m unless $n;           # pattern length start and finish

   #convert to upper case as a first thing
   $buff =~ tr/a-z/A-Z/;
   #
   #<<<<<<<<  MODIFY HERE to experiement with different values of m
   #
   my $kg = Kasiski($buff,$m,$n);
   Log("Kasiski guessed $kg as key\n") if $opt_verb;

   $m1= $kg  unless $m1;           # Key length
   # ok looks good upto now, Hmmm... We need to find IC for various values of m
   #
   #<<<<<<<<  MODIFY HERE to experiement with different values of m
   #
   my ($ics, $cols) = IC($buff,$m1);
   #
   # Now compute mutual Index of Coincidence
   #
   my @guess = MIC($cols, $m1);
   #
   # try to decrypt with this guessed key key
	@guess = split //,$key if $key;
   Vigenere($buff, @guess);
   #
   # OK? No....Try again with different keys.
   #
}
#-------------------------------------------------------------------------------
# 
# GCDs(@) takesan array and returns array of GCD's found, puts it into hash
#
sub GCDs(@)
{
   my ($nums,$hash)= @_;
   my $cnt = @$nums;

   Log(" COUNT = $cnt \n") if $opt_verb;
   for ( my $i=0; $i < $cnt-1; $i++)
   {
      my ($gcd) = ExtendedEuclidean1($$nums[$i], $$nums[$i+1]);
      Log(" GCD($$nums[$i], $$nums[$i+1]) ==> $gcd \n") if $opt_debug;
      $$hash{$gcd}= $gcd;
   }
}
#-------------------------------------------------------------------------------
# We will use euclidean fom Cormen to find GCD's 
#
# Better , from Cormen -Intro to Algorithms, page 812, first edition
sub ExtendedEuclidean1(@)
{
   my($x,$y,$pr_steps,$d) = @_,0;

   if ( $x < $y )
   {                            # make $y smaller of 2  numbers
      my $tmp = $x; $x = $y; $y = $tmp;
   }

   return ($x, 1, 0) if ( $y == 0 );
   my ( $d1,$x1,$y1 ) = ExtendedEuclidean1($y, $x % $y , $pr_steps);

   Log("  ==> GCD($x,$y) $x1 , $y1 \n ") if $pr_steps;
   ($d, $x,$y ) = ($d1, $y1, ($x1 - int($x / $y) * $y1) );

   ($d, $x, $y);
}
#----------------------------------------------------------------------------
sub Log(@)
{
	$log .= join(" ", @_);;
	$log
}
