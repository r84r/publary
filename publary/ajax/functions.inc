<?php

/*********************************************************************************************************************
 *
 *  Functions
 * 
 *  Ralf Bartsch | 2019-04 | https://github.com/r84r
 * 
 *********************************************************************************************************************/

/*
 *  Extended version of function 'implode'
 * 
 *  Join array elements with a string. Sub array will be joined too.
 * 
 *  Parameters:
 *  glue   ... Defaults to an empty string.
 *  pieces ... The array of strings/array to implode.
 * 
 *  Return:
 *  Returns a string containing a string representation of all the array elements in the same order,
 *  with the glue string between each element.
 */
function iterative_implode($glue, $pieces)
{
    // wenn Übergabe kein Array, dann sofortige Rückgabe
    if (!is_array($pieces))
        return $pieces;
    // Array in nummerisch indizierten Array überführen
    $pieces = array_values($pieces);
    $string = '';
    // Array anhand des nummerischen Index durchlaufen (Zählvariable wird benötigt)
    for ($i = 0; $i < count($pieces); $i++)
    {
        // wenn Element ein Array ist, dann die eigene Funktion auf das Element anwenden,
        // ansonsten zum String hinzufügen
        if (is_array($pieces))
            $string .= iterative_implode($glue, $pieces[$i]);
        else
            $string .= $pieces[$i];
        // den Verbinder/Trennzeichen anhängen solange das letzte Element nooch nicht erreicht wurd
        if ($i < (count($pieces) - 1))
            $string .= $glue;
    }
    // Rückgabe
    return $string;
}

/*
 *  Checks if a key string exists in a string. It considers exclusion 
 *  if the key string begins with a minus sign. The function is not case-sensitive.
 * 
 *  Parameters:
 *  needle   ... The searched key string.
 *  haystack ... The string.
 * 
 *  Return:
 *  Returns TRUE if needle is found in the string, FALSE otherwise. If needle
 *  is marked as exclusion (minus sign) it returns FALSE if it is found.
 */
function in_string($needle, $haystack)
{
    if ($needle == '' || $haystack == '')
        return false;
    // check if needle is exclusion marked
    $exclusion = (substr($needle, 0, 1) == '-' ? true : false);
    // remove minus sign
    if (!$exclusion)
        $needle = substr($needle, 1);
    // find the needle in haystack
    $result = (strpos(strtolower($haystack), strtolower($needle)) === false ? false : true);
    // if needle is marked as exclusion return false
    if ($exclusion && $result)
        $result = false;
    // return
    return $result;
}

/*
 *
 */
function in_array_values($needle, $haystack)
{
    foreach ($haystack as $key=>$value)
    {
        if (is_array($value))
            $value = iterative_implode(' ', $value);
        if (in_string($needle, $value))
            return true;
    }
    return false;
}
