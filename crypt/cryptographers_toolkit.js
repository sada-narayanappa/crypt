// **************************** VISIBILITY ****************************

// 0 = i/o
// 1 = edit
// 2 = monoalphabetic
// 3 = vigenere
// 4 = playfair
// 5 = hill
// 6 = RSA
// 7 = stats
// 8 = calc
// 9 = english
// 10 = primes

var ntool = 11; // number of toolbars ( + 1 at the end)

// OBJECT REFERENCE
function e(id) {
    return document.getElementById(id);
}

// RESET SELECTORS (unchecks all selection check boxes)
function resetSelectors() {
    var id;
    for(var i=0; i<ntool; i++) {
        id = "s" + i;
        e(id).checked = false;
    }
}

// returns position of object by id
function position(objId) {
    var obj = document.getElementById(objId);
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft
        curtop = obj.offsetTop
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        }
    }
    return [curleft,curtop];
}

function getStyleObject(objId) {
    // cross-browser function to get an object's style object given its id
    if(document.getElementById && document.getElementById(objId)) { // W3C DOM
        return document.getElementById(objId).style;
    } else if (document.all && document.all(objId)) { // MSIE 4 DOM
        return document.all(objId).style;
    } else if (document.layers && document.layers[objId]) { // NN 4 DOM.. note: this won't find nested layers
        return document.layers[objId];
    } else {
        return false;
    }
} 

function setVisibility(objId, newVisibility) {
    // get a reference to the cross-browser style object and make sure the object exists
    var styleObject = getStyleObject(objId);
    if(styleObject) {
        styleObject.visibility = newVisibility;
        return true;
    } else {
    // we couldn't find the object, so we can't change its visibility
        return false;
    }
} 

function moveTo(objId, newXCoordinate, newYCoordinate) {
    // get a reference to the cross-browser style object and make sure the object exists
    var styleObject = getStyleObject(objId);
    if(styleObject) {
        styleObject.left = newXCoordinate;
        styleObject.top = newYCoordinate;
        return true;
    } else {
        return false;
    }
} 

// calculates thicknesses of invisible components
var thickness = new Array();

function calculateThicknesses() {
    for(var i=0; i<ntool; i++) {
        var id1 = "t"+i; var j = i+1; var id2 = "t"+j;
        thickness[i] = position( id2 )[1] - position( id1 )[1];
    }
    for(var i=0; i<ntool; i++) {
        id1 = "t"+i;
        getStyleObject(id1).position = "absolute";
    }
}

// REDRAWING FORM

function redrawForm() {
    var currentY = 46;
    for(var i=0; i<ntool; i++) {
        var id = "t"+i;
        if(getStyleObject(id).visibility == "visible") {
            moveTo(id, 10, currentY );
            currentY = currentY + thickness[i];    
        }
    }
}

function toggleVisibility(objId) {
    var styleObject = getStyleObject(objId);
    if(styleObject) {
        if(styleObject.visibility == "hidden") {
            styleObject.visibility = "visible";
        } else {
            styleObject.visibility = "hidden";
        }
    }
    redrawForm();
}

// **************** FUNCTIONALITY ************************

// GLOBAL VARIABLES
var alphabet = "abcdefghijklmnopqrstuvwxyz*";

// RESET FORM
function resetForm() {
    e('input').value = "Write a message here!";
    e('output').value = "Click a button and something might happen!";
    e('i_group').checked = false;
    e('i_groupsize').value = 5;
    e('o_group').checked = false;
    e('o_groupsize').value = 5;
    e('s_length').value = "n/a";
    e('s_freq').value = "n/a";
    e('s_di').value = "n/a";
    e('s_tri').value = "n/a";
    e('s_n').value = "6";
    e('s_n_output').value = "n/a";
    e('s_word').value = "text";
    e('s_dist').value = "n/a";
    e('s_ic').value = "n/a";   
    e('s_ft').value = "n/a";
    e('e_extract').checked = true;
    e('e_extract_n').value = 1;
    e('e_extract_s').value = 1;
    e('e_compare_num').value = "n/a";
    e('e_compare_den').value = "n/a";
    e('e_compare_per').value = "n/a";
    e('m_radio1').checked = true;
    e('m_mult').value = 1;
    e('m_shift').value = 0;
    e('m_mult2').value = 1;
    e('m_shift2').value = 0;
    for (var i=0; i<26; i++) {
        var id = "m_" + i;
        e(id).value = "";
    }
    e('v_keyword').value = "";
    e('v_add').checked = true;
    e('p_replace').value = "x";
    e('p_last').value = "q";
    e('p_row').value = 1;
    e('p_column').value = 1;
    for (var i=0; i<5; i++) {
        for (var j=0; j<5; j++) {
            id ="p_" + i + j;
            e(id).value = alphabet.charAt( 5*i + j);
        }
    }
    e('h_last').value="qq";
    e('h_00').value=1; e('h_01').value=0;
    e('h_10').value=0; e('h_11').value=1;
    e('h3_00').value=1; e('h3_01').value=0; e('h3_02').value=0;
    e('h3_10').value=0; e('h3_11').value=1; e('h3_12').value=0;
    e('h3_20').value=0; e('h3_21').value=0; e('h3_22').value=1;
    e('rsa_n').value=15244129;
    e('rsa_e').value=1793971;
    e('rsa_d').value=14276431;
    e('rsa_end').value = "qqqqq";
    e('c_mod1').value = 0;
    e('c_mod2').value = 26;
    e('c_mod3').value = 0;
    e('c_gcd1').value = 12;
    e('c_gcd2').value = 15;
    e('c_gcd3').value = 3;
    e('c_inv1').value = 1;
    e('c_inv2').value =26;
    e('c_inv3').value = 1;
    e('c_sol1').value = 2;
    e('c_sol2').value = 0;
    e('c_sol3').value = 26;
    e('c_sol4').value = "0, 13";
}

// ARITHMETIC FUNCTIONS
function mod(a,b) { // better mod than the built in one. My mod always returns a nonnegative remainder. 
    if (b<0) {b = (-1)*b;}
    if (b==0) { return "#err"; } // a mod 0 makes no sense
    var c =  a % b;
    if (c<0) { c = c+b; }
    return c;
}

function gcd(a,b) { // greatest common divisor
    if (a<0) { a = (-1)*a; }
    if (b<0) { b = (-1)*b; }
    if (a==0 || b==0) { return "#err"; }
    var c = 1;
    while (c>0) {
        if (a<b) { c=b; b=a; a=c; } // to make sure that a>=b
        if (a>=b) { c = mod(a,b); a=b; b=c; }
    }
    return a;
}

function truncate( x, ndig ) { // truncates x so that it has ndig decimal digits
    var power = 10;
    for (var i=1; i<ndig; i++) {
        power = power*10;
    }
    return (x*power - mod(x*power,1))/power;
}

function powerMod( a, b, n ) { // efficiently calculates (a to the power of b) modulo n
    if ( b==0 ) {
        return 1;
    }
    if ( mod(b,2)==1 ) { // odd power
        return mod( a*powerMod(a,b-1,n), n );
    }
    // even power
    var root = powerMod( a, b/2, n );
    return mod( root*root, n );
}

// STRING FUNCTIONS

//removes all characters c from a string s
function removeChar( s, c ) {
    var p = s.indexOf(c);
    while (p>-1) {
        s = s.substring(0,p) + s.substring(p+1,s.length);
        p = s.indexOf(c);
    }
    return s;
}

//sanitizes string s
function sanitizedStr( s, allowed ) {
    if (s=="") { return s; }
    s = s.toLowerCase();
    var z="";
    var x;
    for (var i=0; i<s.length; i++) {
        x = allowed.indexOf( s.charAt(i) );
        if ( x > -1 ) {
            // valid character
            z = z + allowed.charAt( x );
        }
    }
    return z;
}

function displayText( t, id ) {
    t = sanitizedStr( t, alphabet );
    // force wrap around
    var s = "";
    var grouping = e('i_group').checked;
    var groupsize = e('i_groupsize').value;
    if (id=='output') {
        grouping = e('o_group').checked;
        groupsize = e('o_groupsize').value;
    }
    for (var i=0; i<t.length; i++) {
        s = s + t.charAt( i );
        if (grouping) {
            if ( mod(i+1,groupsize) == 0 ) { s = s + ' '; }
        } else  {
            if ( mod(i+1,90) == 0 ) { s = s + '\n'; }
        }
    }
    e(id).value = s;
}

function inputToOutput() {
    displayText( e('input').value, 'output');
    displayText( "", 'input');
}

function outputToInput() {
    displayText( e('output').value, 'input');
    displayText( "", 'output');
}

function interchangeInputAndOutput() {
    var s = e('output').value;
    inputToOutput();
    displayText( s, 'input');
}

function reformatText( id ) {
    displayText( e(id).value, id );
}

// EDITOR TOOLBAR
function applyEdit() {
    var s = sanitizedStr( e('input').value, alphabet );
    if (e('e_extract').checked == true) { // extract every mth character from the text       
        var z = "";
        var pos = e('e_extract_s').value*1 - 1;
        while (pos < s.length ) {
            z = z + s.charAt(pos);
            pos = pos + e('e_extract_n').value*1;
        }
        displayText(z, 'output');
    } else { // compare input and output
        var so = sanitizedStr( e('output').value, alphabet );
        var m = s.length; 
        if (so.length > m) { m = so.length; } // purposely take longer string
        var same = 0;
        for (i=0; i<m; i++) {
            if (s.charAt(i)==so.charAt(i)) { same++; }
        }
        e('e_compare_num').value = same;
        e('e_compare_den').value = m;
        e('e_compare_per').value = 100*same/m;
    }
}

// COUNTING FREQUENCIES OF CHARACTERS, DIGRAPHS, TRIGRAPHS, ETC.
function sortSpecial(a,b) {
    // given an array of the form [ [n1,s1], [n2,s2], ... ], where ni is an integer and si is a string,
    // it sorts the array according to the integers ni in decreasing order
    return b[0] - a[0];
}

function countSubstrings( s, d ) {
    // counts substrings of length d in s
    // returns sorted list [ [n1,s1], [n2,s2], ... ]

    var f = new Array();
    var n = 0; // number of different substrings so far
    var t;
    var pos;
    for (var i=0; i<s.length - d + 1; i++) {
        t = s.substring(i,i+d);  // substring(i,j) starts at i and ends at j-1 !!!
        pos = -1;
        for (var j=0; j<n; j++) {
            if (t==f[j][1]) { pos = j; }
        }
        if (pos==-1) { //new digraph
            f[n] = new Array();
            f[n][0] = 1;
            f[n][1] = t;
            n = n + 1;
        } else { //existing digraph
            f[pos][0] = f[pos][0] + 1;
        }
    }
    f.sort(sortSpecial);
    return f;
}

function displayCount( f, id ) {
    // displays count f obtained by countSubstrings in id as a string
    var s="";
    var max = f.length;
    if (f.length>26) { max = 26;}
    for (var i=0; i<max; i++) {
        s = s + f[i][1] + f[i][0] + ' ';
    }
    e(id).value = s;
}

// MONOALPHABETIC CIPHER
function applyMono() {
    var t = sanitizedStr( e('input').value, alphabet );
    var c = "";
    var x;

    if ( e('m_radio1').checked )
    { // affine cipher x -> ax+b
        var a = e('m_mult').value * 1;
        var b = e('m_shift').value * 1;
        for (var i = 0; i < t.length; i++ ) {
            x = alphabet.indexOf( t.charAt( i ) );
            x = mod(a*x + b, 26);
            c = c + alphabet.charAt( x );
        }
    }
    if ( e('m_radio2').checked )
    { // affine cipher x -> a(x+b)
        var a = e('m_mult2').value * 1;
        var b = e('m_shift2').value * 1;
        for (var i = 0; i< t.length; i++ ) {
            x = alphabet.indexOf( t.charAt( i ) );
            x = mod(a*(x+b), 26);
            c = c + alphabet.charAt( x );
        }
    }
    if ( e('m_radio3').checked )
    { // specific monoalphabetic substitution
        // sanitize all substitutions
        var id;
        for (var i=0; i<26; i++) {
            id = "m_" + i;
            e(id).value = sanitizedStr( e(id).value, alphabet );
        }
        for (var i=0; i < t.length; i++ ) {
            x = alphabet.indexOf( t.charAt( i ) );
            id = "m_" + x;
            if ( e(id).value=="" ) { // character not specified
                c = c + "*";
            } else {
                c = c + e(id).value;
            }
        }
    }
    displayText(c, 'output');
}

// VIGENERE TOOLBAR
function applyVige() {
    var t = sanitizedStr( e('input').value, alphabet );
    var keyword = sanitizedStr( e('v_keyword').value, alphabet );
    e('v_keyword').value = keyword;
    if (keyword.length == 0) { // do nothing
        displayText( t, 'output' );
    } else { // add or subtract the keyword
        var k = ""; // repeated keyword
        while (k.length < t.length) {
            k = k + keyword;
        }
        var s = ""; // output
        for (var i=0; i<t.length; i++) {
            var x = alphabet.indexOf( t.charAt(i) );
            if (e('v_add').checked) { // add keyword
                x = x + alphabet.indexOf( k.charAt(i) )
            } else { // subtract keyword
                x = x - alphabet.indexOf( k.charAt(i) )
            }
            s = s + alphabet.charAt( mod(x,26) );
        }
        displayText( s, 'output');
    }
}

// PLAYFAIR TOOLBAR
function erasePlayfair() {
    for (var i=0; i<5; i++) {
        for (var j=0; j<5; j++) {
            id ="p_" + i + j;
            e(id).value = '';
        }
    }
}

function applyPlayfair() {
    // capture the square
    var p = new Array();
    var rest = alphabet.substring(0,alphabet.length-1);
    for (var i=0; i<5; i++) { p[i] = new Array(); }
    for (var i=0; i<5; i++) {
        for (var j=0; j<5; j++) {
            var id = "p_" + i + j;
            if( e(id).value.length > 0 ) {
                p[i][j] = e(id).value.charAt(0);
                rest = removeChar( rest, p[i][j] );
            }
        }
    }
    if (rest.length > 1 ) {
        alert( "Playfair square has to contain all but one character of the alphabet." )
        return "";
    }
    var t = sanitizedStr( e('input').value, alphabet );
    // delete all occurences of the missing character
    t = removeChar( t, rest.charAt(0) );
    // make sure text is of even length
    if ( mod( t.length, 2 ) == 1 ) { t = t + e('p_last').value; }
    // calculate output
    var s = "";
    while (t.length > 0) {
        var p1 = t.charAt(0);
        var p2 = t.charAt(1);
        // make sure not a double character
        if (p1==p2) { p2 = e('p_replace').value.charAt(0); }
        for (var i=0; i<5; i++) {
            for (var j=0; j<5; j++) {
                if( p[i][j] == p1 ) { var i1 = i; var j1 = j; }
                if( p[i][j] == p2 ) { var i2 = i; var j2 = j; }
            }
        }
        // in the same row
        if (i1 == i2) {
            j1 = j1 + e('p_row').value*1; j1 = mod(j1,5);
            j2 = j2 + e('p_row').value*1; j2 = mod(j2,5);
        }
        // in the same column
        if (j1 == j2) {
            i1 = i1 + e('p_column').value*1; i1 = mod(i1,5);
            i2 = i2 + e('p_column').value*1; i2 = mod(i2,5);
        }
        // not in the same column or row
        if (i1 != i2 && j1 != j2 ) {
            var dummy = j1;
            j1 = j2;
            j2 = dummy;
        }
        s = s + p[i1][j1] + p[i2][j2];
        t = t.substring( 2, t.length );
    }
    displayText(s, 'output');
}

// HILL'S SYSTEM
function applyHill() {
    if ( e('h_radio1').checked ) {
        var a = e('h_00').value*1; 
        var b = e('h_01').value*1;
        var c = e('h_10').value*1; 
        var d = e('h_11').value*1;
        var s = sanitizedStr( e('input').value, alphabet );
        // make sure text is of even length
        if ( mod( s.length, 2 ) == 1 ) { s = s + e('h_last').value.charAt( 0 ); }
        var t = "";
        for (i=0; i<s.length; i=i+2) {
            var x = alphabet.indexOf( s.charAt(i) );
            var y = alphabet.indexOf( s.charAt(i+1) );        
            t = t + alphabet.charAt( mod( a*x + b*y, 26 ) );
            t = t + alphabet.charAt( mod( c*x + d*y, 26 ) );
        }
        displayText(t, 'output');
    } else {
        var h00 = e('h3_00').value*1;
        var h01 = e('h3_01').value*1;
        var h02 = e('h3_02').value*1;
        var h10 = e('h3_10').value*1;
        var h11 = e('h3_11').value*1;
        var h12 = e('h3_12').value*1;
        var h20 = e('h3_20').value*1;
        var h21 = e('h3_21').value*1;
        var h22 = e('h3_22').value*1;
        var s = sanitizedStr( e('input').value, alphabet );
        // make sure text is of length divisible by 3
        if ( mod( s.length, 3 ) == 2 ) { // must add 1 character
            s = s + e('h_last').value.charAt( 0 );
        }
        if ( mod( s.length, 3 ) == 1 ) { // must add 2 characters
            s = s + e('h_last').value;
        }
        var t= "";
        for (i=0; i<s.length; i=i+3) {
            var x = alphabet.indexOf( s.charAt(i) );
            var y = alphabet.indexOf( s.charAt(i+1) );
            var z = alphabet.indexOf( s.charAt(i+2) );
            t = t + alphabet.charAt( mod( h00*x + h01*y + h02*z, 26 ) );
            t = t + alphabet.charAt( mod( h10*x + h11*y + h12*z, 26 ) );
            t = t + alphabet.charAt( mod( h20*x + h21*y + h22*z, 26 ) );
        }
        displayText(t, 'output');
    }
}

// RSA
function powerRSA( exponent, encryption ) {
    var s = sanitizedStr( e('input').value, alphabet );
    var n = e('rsa_n').value*1; // modulus
    if ( n < 26 ) {
        e('output').value = "#ERR: The parameter n must be at least 25.";
        return fail;
    }
    // deciding how many characters should be processed at once
    // (MATH) In the encryption, I can process k characters at once if 26^k <= n.
    // But consider this particular encryption:
    // Assume that n = 35, say. Then k = 1, so I will process 1 character at a time.
    // Assume further that exponent = 5, say.  Then "c" = 2 is encrypted as 2^5 mod 35 = 32.
    // The problem is that I cannot encode the result (32) with one character only.
    // So, to be safe, we must encode the result as a group of k+1 characters.
    // The code lines affected by this observation are marked with "!".
    var i = 26*26;
    var chars = 1;
    while ( i <= n ) {
        i = i * 26;
        chars = chars + 1;
    }
    if (!encryption) { // "!"
        chars = chars + 1;
    }
    e('output').value = ""; // erasing the output text area
    if ( e('rsa_log').checked ) { // printing intermediate results
        if (chars==1) {
            e('output').value = "Processing 1 character at a time.\n";
        } else {
            e('output').value = "Processing " + chars + " characters at a time.\n";
        }
    }
    if (encryption) {
        // how many characters must be added to make the length divisible by chars ?
        var add_chars = chars - mod( s.length, chars );
        if (add_chars == chars ) { 
            add_chars = 0;
        }
        for (var i=0; i<add_chars; i++) {
            s = s + e('rsa_end').value.charAt( i );
        }
    }
    // splitting message and translating its parts into numbers
    var a = new Array(); 
    var m = s.length / chars; 
    for (var i=0; i<m; i++) {
        // a[i] will contain the numerical equivalent of the ith group of letters
        a[ i ] = 0;
        for (var j=0; j<chars; j++) {
            var x = alphabet.indexOf( s.charAt( i*chars + j ) );
            a[ i ] = a[ i ] + Math.pow(26,j)*x;
        }       
    }
    if ( e('rsa_log').checked ) { // printing intermediate results
        e('output').value += "The numerical equivalents of the groups of characters are:\n";
        s = "";
        for (var i=0; i<m; i++) {
            s += a[ i ] + " ";
        }
        e('output').value += s + "\n";
    }
    // raising groups to the exponent
    for (var i=0; i<m; i++) {
        a[ i ] = powerMod( a[ i ], exponent, n );
    }
    if ( e('rsa_log').checked ) { // printing intermediate results
        e('output').value += "Upon raising these to the exponent " + exponent + " and reducing modulo " + n + ", we have:\n";
        s = "";
        for (var i=0; i<m; i++) {
            s += a[ i ] + " ";
        }
        e('output').value += s + "\n";
    }
    // translating back into characters
    s = "";
    if (!encryption) { // "!"
        chars = chars - 2;
    }
    for (var i=0; i<m; i++) {
        for (var j=0; j<=chars; j++) {  
            var r = mod( a[ i ], 26);
            s = s + alphabet.charAt( r );
            a[ i ] = (a[ i ] - r) / 26;
        }
        if (e('rsa_log').checked) { // for easier reading of final output
            s = s + " "; 
        }
    }
    if ( e('rsa_log').checked ) { // priting intermediate results 
        e('output').value += "Finally, the letter equivalents of these numbers are:\n";
    } 
    e('output').value += s;
}

function encryptRSA() {
    powerRSA( e('rsa_e').value*1, true );
}

function decryptRSA() {
    powerRSA( e('rsa_d').value*1, false );
}

// STATISTICS TOOLBAR
function applyStatsLength() {
    var s = sanitizedStr( e('input').value, alphabet );
    e('s_length').value = s.length;
}

function applyStatsFreq() {
    var s = sanitizedStr( e('input').value, alphabet );
    displayCount( countSubstrings( s, 1 ), 's_freq');
}

function applyStatsDi() {
    var s = sanitizedStr( e('input').value, alphabet );
    displayCount( countSubstrings( s, 2 ), 's_di');
}

function applyStatsTri() {
    var s = sanitizedStr( e('input').value, alphabet );
    displayCount( countSubstrings( s, 3 ), 's_tri');
}

function applyStatsN() {
    var s = sanitizedStr( e('input').value, alphabet );
    // count frequencies of n-graphs with given n
    var m = e('s_n').value * 1;
    displayCount( countSubstrings( s, m ), 's_n_output');
}

function applyStatsDist() {
    var s = sanitizedStr( e('input').value, alphabet );
    // calculate distances between occurrences of a word
    e('s_word').value = sanitizedStr( e('s_word').value, alphabet );
    if (e('s_word').value != "" ) {
        var d = new Array(); //recorded distances
        var nd = 0; //how many occurrences
        var p = 0; // position of last occurrence
        while (p>-1) {
            p = s.indexOf( e('s_word').value );
            if ( p>-1 ) {
                s = s.substring( p + 1, s.length );
                if ( nd > 0 ) { d[nd-1] = p + 1; }
                nd = nd + 1;
            }
        }
        // display distances
        s="";
        for (var i=0; i<d.length; i++) { s = s + d[i] + " "; }
        if (s=="") { e('s_dist').value = "the string does not occur more than once" }
        else {  e('s_dist').value = s; }
    } else {
        e('s_dist').value = "n/a";
    }
}

function applyStatsIC() {
    var s = sanitizedStr( e('input').value, alphabet );
    // calculate index of coincidence
    var f = countSubstrings( s, 1 );
    var ic = 0;
    for (var i=0; i<f.length; i++) { ic = ic + f[i][0]*(f[i][0]-1); }
    ic = truncate( ic / (s.length * (s.length - 1)), 5 );
    e('s_ic').value = ic;
}

function applyStatsFriedman() {
    var s = sanitizedStr( e('input').value, alphabet );
    // calculate the Friedman test (most of index of coincidence is repeated here)
    var n = s.length;
    var f = countSubstrings( s, 1 );
    var ic = 0;
    for (var i=0; i<f.length; i++) { ic = ic + f[i][0]*(f[i][0]-1); }
    ic = truncate( ic / (s.length * (s.length - 1)), 5 );
    var ft = truncate( (0.027)*n/((n-1)*ic - 0.038*n + 0.065), 5 );
    e('s_ft').value = ft;
}

// CALCULATOR
function applyCalcMod() {
    e('c_mod3').value = mod( e('c_mod1').value * 1, e('c_mod2').value * 1 );
}

function applyCalcGcd() {
    e('c_gcd3').value = gcd( e('c_gcd1').value * 1, e('c_gcd2').value * 1 );
}

function applyCalcInv() {
    var a = e('c_inv1').value *1;
    if (a<0) {a=(-1)*a;}
    var b = e('c_inv2').value *1;
    if (b<0) {b=(-1)*b;}
    if (gcd(a,b)!= 1) { e('c_inv3').value="#err"; }
    else {
        var c = 1;
        while( mod(a*c,b)!=1 ) { c = mod( a*c, b); }
        e('c_inv3').value = c;
    }
}

function applyCalcSol() {
    var a = e('c_sol1').value *1;
    var b = e('c_sol2').value *1;
    var c = e('c_sol3').value *1;
    if (c<0) { c = (-1)*c; }
    var s = "";
    for (var x=0; x<c; x++) {
        if ( mod(a*x-b,c)==0 ) { // found a solution
            if (s=="") { s = s + x; }
            else { s = s + ", " + x; }
        }
    }
    e('c_sol4').value = s;
}
