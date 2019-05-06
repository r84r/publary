<?php
/*********************************************************************************************************************
 *
 *  Rückgabe der angeforderten Veröffentlichungen als JSON
 * 
 *********************************************************************************************************************/

require_once('ajax.inc');
require_once('functions.inc');

// Übergabewerte ermitteln
$query  = variable('query');
$entry  = variable('entry');
if ($entry == 'diss') // Sonderfall
{
    $entry = 'type';
    $query = 'phdthesis';
}
// Datenbank laden
$lib    = json_decode(file_get_contents('../'.PUBLARY_LIB_FILE), true);
// Rückgabe-Array initialisieren
$answer = array();

// wenn keine Suchbegriffe übergeben werden, dann wird die komplette Datenbank zurückgegeben,
// ansonsten wird die Suche durchgeführt
if ($query === null or $query !== null and $query == '')
{
    $answer = $lib;
}
else
{
    // Suchbegriffe in Liste überführen
    $terms  = explode(' ', urldecode($query));
    // Jeden Datenbankeintrag durchlaufen
    foreach ($lib as $item)
    {
        // Variable für die Suchbegriffe: true bedeutet, dass alle Begriffe gefunden wurden
        $all = true;
        // Jeden Suchbegriff durchlaufen und prüfen ob er in der Liste zu finden ist
        foreach ($terms as $needle)
        {
            // ein Suchbegriff wurde nicht gefunden, d.h. die Suche wird abgebrochen
            if (!in_array_values($needle, $item))
            {
                $all = false;
                break;
            }
        }
        // Prüfung auf die Eintragsbeschränkung durchführen
        if ($all and $entry !== null and $entry != '')
        {
            $all = ($item[$entry] == $query);
        }
        // wenn alle Suchbegriffe gefunden wurden, Datenbankeintrag zur Rückgabe hinzufügen
        if ($all)
        {
            $answer[] = $item;
        }
    }
}

/* Monatsangaben vereinheitlichen */
function convertMonthToNumber($month)
{
    if (is_numeric($month))
    {
        if (strlen($month) <= 2)
        {
            $int = intval($month);
            if ($int >= 1 and $int <= 12)
                return $int;
        }
    }
    else
    {
        return date('m', strtotime($month));
    }
    return 0;
}
foreach($answer as &$item)
{
    if (array_key_exists('month', $item))
    {
        $month = convertMonthToNumber($item['month']);
        if ($month == 0)
            unset($item['month']);
        else
            $item['month'] = $month;
    }
}

// Einträge nach Jahr und Monat absteigend sortieren
function newestDateToTop($a, $b)
{
    $a_val = $a['year'] * 100 + (array_key_exists('month', $a) ? $a['month'] : 0);
    $b_val = $b['year'] * 100 + (array_key_exists('month', $b) ? $b['month'] : 0);

    if ($a_val == $b_val)
        return 0;
    else
        return ($a_val > $b_val ? -1 : 1);
}
usort($answer, 'newestDateToTop');

// JSON als Antwort zurückgeben
answer($answer);

