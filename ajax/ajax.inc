<?php

require_once('../setup.inc');

/*********************************************************************************************************************
 *
 *  Funktionen für die AJAX-Abfragen
 * 
 *********************************************************************************************************************/

/*
 *  Gibt ein JSON zurück. Vorerst als Dummy für evtl. zukünftige Komprimierung oder Verschlüsselung
 */
function answer($array)
{
    header('Content-Type: application/json; charset=utf-8');
    print(json_encode($array, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK));
    die();
}

/*
 *  Gibt eine Fehlermeldung als JSON zurück
 */
function error($message)
{
    header('Content-Type: application/json; charset=utf-8');
    print(json_encode(array(
                        'error' => true,
                        'message' => $message
                      ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK));
    die();
}

/*
 *  Liest eine Übergabevariable aus. Falls sie nicht übergeben wurde, dann wird 'null' zurückgegeben.
 */
function variable($key)
{
    if (isset($_POST[$key]))
        return $_POST[$key];
    elseif (isset($_GET[$key]))
        return $_GET[$key];
    else
        return null;
}

/*
 *  Prüft ob die Variable eine Zahl ist und beendet das Skript wenn nicht.
 */
function verifyInteger($var)
{
    if (!ctype_digit($var))
        error('Parameter value is not allowed. '.$var);
}
