<?php
/*********************************************************************************************************************
 *
 *  Rückgabe einer Liste mit allen Jahren in der eine Veröffentlichung in DB vorliegt
 * 
 *  Listenformat: key = Jahr, value = Anzahl der Veröffentlichung
 * 
 *********************************************************************************************************************/

require_once('ajax.inc');

// Datenbank laden
$library = json_decode(file_get_contents('../'.PUBLARY_LIB_FILE), true);
// Rückgabe-Array initialisieren
$answer  = array();

// Datenbank durchlaufen
foreach ($library as $item)
{
    if (!isset($item['year']))
        continue;
    $year = $item['year'];
    if (array_key_exists($year, $answer))
    {
        $answer[$year] += 1;
    }
    else
    {
        $answer[$year] = 1;
    }
}

// Rückgabeliste absteigend sortieren
krsort($answer);

// JSON als Antwort zurückgeben
answer($answer);