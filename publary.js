'use strict';

/**************************************************************************************************
 * 
 *  publary - a publication library include for websites based on PHP+AJAX+Bootstrap+BibTex 
 *  
 *  license and info: https://github.com/r84r/publary
 * 
 *  last modification: 2019-05-03, Ralf Bartsch
 * 
 *************************************************************************************************/


/*
 *  Setup
 */

/* Pfad von publary */
const PUBLARY_PATH = 'publary/';

/* Sprachauswahl anhand der URL (RegEx-Ausdruck) */
const LANGUAGE_URL_SELECTOR_EN = /\ben\.php\b$/;

/*
 *  Begriffsübersetzungen
 */
const TRANSLATION = {
    'en': {
        'months':          [ 'January', 'February', 'March', 'April', 'May', 'June',
                            'July', 'August', 'September', 'October', 'November', 'December' ],
        'texType':         { 'article':       'Article',
                             'inproceedings': 'Conference Article',
                             'conference':    'Conference Article',
                             'proceedings':   'Proceedings',
                             'incollection':  'Book Contribution',
                             'inbook':        'Book Contribution',
                             'book':          'Book',
                             'booklet':       'Booklet',
                             'techreport':    'Report',
                             'manual':        'Manual',
                             'patent':        'Patent',
                             'phdthesis':     'PhD Thesis',
                             'mastersthesis': 'Thesis' },
        'issue':             'Iss.',
        'number':            'No.',
        'p.':                'p.',
        'pp.':               'pp.',
        'viewFulltextAsPdf': 'Fulltext (PDF)',
        'downloadBib':       'Download citation (BibTeX)',
        'phdtheses':         'PhD Theses',
        'abstract':          'Abstract',
        'keywords':          'Keywords',
        'switchToBriefList': 'Show compact list',
        'switchToFullList':  'Show detailed list',
    },
    'de': {
        'months':          [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                             'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
        'texType':         { 'article':       'Artikel',
                             'inproceedings': 'Konferenzbeitrag',
                             'conference':    'Konferenzbeitrag',
                             'proceedings':   'Tagungsband',
                             'incollection':  'Buchbeitrag',
                             'inbook':        'Buchbeitrag',
                             'book':          'Buch',
                             'booklet':       'Heft / Broschüre',
                             'techreport':    'Bericht',
                             'manual':        'Dokumentation',
                             'patent':        'Patent',
                             'phdthesis':     'Dissertation',
                             'mastersthesis': 'Abschlussarbeit' },
        'issue':             'Heft',
        'number':            'Nr.',
        'p.':                'S.',
        'pp.':               'S.',
        'viewFulltextAsPdf': 'Volltext (PDF)',
        'downloadBib':       'Zitierung herunterladen (BibTeX)',
        'phdtheses':         'Dissertationen',
        'abstract':          'Kurzfassung',
        'keywords':          'Schlüsselwörter',
        'switchToBriefList': 'Zeige weniger Infos',
        'switchToFullList':  'Zeige mehr Infos',
    }
};

function encodeURL(path) {
    return path.split('\\').map(encodeURIComponent).join('/');
}

/*
 *  Generate a string containing all authors
 */
function publaryGenerateAuthorsString(authors, etAl = true, showFirstname = true, firstnameInitial = true) {
    var a = [];
    for (var i = 0; i < authors.length; i++)
        if (showFirstname)
            a.push(authors[i]['last']);
        else
            a.push(authors[i]['last'] + ', ' + (firstnameInitial ? authors[i]['first'].substr(0, 1)+'.' : authors[i]['first']));
    if (a.length > 2 && etAl) {
        return a[0]+' et al.';
    } else if (a.length == 2) {
        return a.join(' & ');
    } else {
        return a.join('; ');
    }
}

/*
 *  Veröffentlichungliste aktualisieren
 */
function publaryRefreshList() {
    $.get(PUBLARY_PATH + 'ajax/pub-list.php' + query)
        .done(function(queriedPubs) {
            /* alte Listeneinträge entfernen */
            while (publaryList.firstChild)
                publaryList.removeChild(publaryList.firstChild);
            /* neue Listeneinträge generieren */
            for (var i = 0; i < queriedPubs.length; i++)
                publaryAddListItem(queriedPubs[i]);
        });
}

/*
 *  Veröffentlichung zur Liste hinzufügen
 */
function publaryAddListItem(pub) {
    if (!pub) return null;
    /* Informationen vorbereiten */
    var briefItem = ($('.switch-list .brief-list').hasClass('d-none') ? ' d-none' : ''),
        type      = pub['type'],
        key       = pub['citation-key'],
        title     = pub['title'],
        authors   = publaryGenerateAuthorsString(pub['author'], (briefItem != ''), (briefItem != ''), true),
        year      = ('year' in pub ? pub['year'] : ''),
        abstract  = ('abstract' in pub ? pub['abstract'] : ''),
        keywords  = '',
        journal   = '',
        links     = '',
        html, href;
    /* Veröffentlichungsinfo */
    if (type == 'phdthesis') {
        type    = lang['texType']['phdthesis'];
        journal = type + ', ' + year + ', ' + pub['school'];
    } else if (type == 'mastersthesis') {
        type    = lang['texType']['thesis'];
        journal = type + ', ' + year + ', ' + pub['school'];
    } else {
        if ('journal' in pub)        journal  = pub['journal']
        else if ('booktitle' in pub) journal  = pub['booktitle'];
        if (type == 'techreport')    journal  = ('howpublished' in pub ? pub['howpublished'] : '');
        type = lang['texType'][type];
        if (type == undefined)
            type = lang['texType']['article'];
        if ('volume' in pub)         journal += ', <span class="publary-format-volissno">Vol.&nbsp;' + pub['volume'] + '</span>';
        if ('issue' in pub)          journal += ', <span class="publary-format-volissno">' + lang['issue'] + '&nbsp;' + pub['issue'] + '</span>';
        if ('number' in pub)         journal += ', <span class="publary-format-volissno">' + lang['number'] + '&nbsp;' + pub['number'] + '</span>';
        if ('pages' in pub) {
            var pages = pub['pages'];
            pages                             = ', <span class="publary-format-pages">'
                                                + (typeof pages === 'number' || pages.indexOf('-') == -1
                                                  ? lang['p.'] + '&nbsp;' + pages
                                                  : lang['pp.'] + '&nbsp;' + pages)
                                                + '</span>';
            journal                          += pages.replace('--', '-');
        }
        if ('publisher' in pub)      journal += ', <span class="publary-format-address">' + pub['publisher'] + '</span>';
        if ('address' in pub)        journal += ', <span class="publary-format-address">' + pub['address'] + '</span>';
        journal                              += ', <span class="publary-format-date">'
                                                + ('month' in pub ? lang['months'][pub['month']-1] + '&nbsp;' : '')
                                                + year + '</span>';
        if ('isbn' in pub)           journal += ', <span class="publary-format-isbn">ISBN&nbsp;' + pub['isbn'] + '</span>';
        if ('issn' in pub)           journal += ', <span class="publary-format-issn">ISSN&nbsp;' + pub['issn'] + '</span>';
        if ('doi' in pub)            journal += ', <span class="publary-format-doi">DOI&nbsp;<a href="https://doi.org/' 
                                                + pub['doi'] + '">' + pub['doi'] + '</a></span> ';
        if ('urn' in pub)            journal += ', <span class="publary-format-urn">URN&nbsp;<a href="http://nbn-resolving.de/' 
                                                + pub['urn'] + '">' + pub['urn'] + '</span> ';
    }
    /* Links */
    if ('pdfpath' in pub) links += '<a href="' + encodeURL('publary\\' + pub['pdfpath']) + '" target="_blank" data-rel="none"><i class="far fa-file-pdf"></i> ' + lang['viewFulltextAsPdf'] + '</a> ';
    if ('url' in pub)     links += '<a href="' + pub['url'] + '" target="_blank" data-rel="none"><i class="fas fa-external-link-alt"></i> Link</a> ';
    links                       += '<a href="' + encodeURL('publary\\' + pub['bibpath']) + '" download target="_blank" data-rel="none"><i class="far fa-comment-alt"></i> ' + lang['downloadBib'] + '</a> ';
    /* Schlüsselwörter aufbereiten */
    if ('keywords' in pub)
        pub['keywords'].forEach(function(keyword){ keywords += '<span class="keyword">'+keyword+'</span> '; });
    /* Aufklapplink hinzufügen, wenn Kurzfassung oder Schlüsselwörter vorhanden */
    href =  (abstract == '' && keywords == '' ? '' : ' href="#' + key + '"');
    /* Informationen als HTML aufbereiten */
    html =  '<div class="publary-item-type'+briefItem+'">' + type + '</div>' +
            '<div class="publary-item-title"><a class="collapsed" data-toggle="collapse"' + href + '>' + title + '</a></div>' +
            '<div class="publary-item-authors">' + authors + '</div>' +
            '<div class="publary-item-journal' + briefItem + '">' + journal + '</div>' +
            '<div class="publary-item-links">' + links + '</div>' +
            '<div id="' + key + '" class="collapse publary-item-abstract">' + 
                (abstract != '' ? '<strong>' + lang['abstract'] + '</strong><div>' + abstract + '</div>' : '') + 
                (keywords != '' ? '<strong>' + lang['keywords'] + '</strong><div>' + keywords + '</div>' : '') +
            '</div>';
    /* virtuellen Listeneintrag erstellten */
    var item = document.createElement('li');
    item.classList.add('publary-item');
    item.innerHTML = html;
    /* Eintrag der Liste hinzufügen */
    publaryList.appendChild(item);
}

/*
 *  Globale Variablen definieren
 */
var publaryQuery = document.querySelector('#publary-filter-query'),
    publaryList  = document.querySelector('#publary-list'),
    lang         = (LANGUAGE_URL_SELECTOR_EN.test(location.href.replace(location.hash, ''))
                    ? TRANSLATION['en'] : TRANSLATION['de']),
    inputTimeout = null,
    query;

/*
 * wenn Dokument fertig geladen, dann Ereignisse hinzufügen und ausführen
 */
$(document).ready(function() {

    /* Ansichtsschalter */
    $('.switch-list .brief-list i').after('&nbsp; ' + lang['switchToBriefList']);
    $('.switch-list .full-list i').after('&nbsp; ' + lang['switchToFullList']);
    $('.switch-list').click(function() {
        $('.switch-list .brief-list').toggleClass('d-none');
        $('.switch-list .full-list').toggleClass('d-none');
        publaryRefreshList();
    });

    /* Klick auf Tabs aktualisiert die Liste */
    $('.nav-tabs a:not(.dropdown-toggle):not(.switch-list)').click(function(){
        var value = $(this).attr('href').substr(1);
        if ($(this).hasClass('dropdown-item')) {
            var tabs = $('.nav-tabs a.nav-link:not(.dropdown-toggle)');
            tabs.removeClass('active')
                .attr('aria-selected', 'false');
            tabs.last().attr('href', '#' + value)
                       .html($(this).html())
                       .addClass('active')
                       .attr('aria-selected', 'true');
            // Bootstrap 3
            $('.dropdown li').removeClass('active');
            $('.dropdown-item').attr('aria-selected', 'false');
            console.log(tabs);
        }
        // Anker in der Adresszeile aktualisieren
        if (history.pushState)
            history.pushState(null, null, $(this).attr('href'));
        else
            location.hash = $(this).attr('href');
        // Suchfeld leeren
        $(publaryQuery).val('');
        // Liste neu abrufen
        query = (value == 'diss'
                ? '?entry=diss'
                : '?query=' + value + '&entry=year');
        publaryRefreshList();
    })

    /* bei Tastenanschlag: Suche nach einer Verzögerung starten */
    $(publaryQuery).keyup(function() {
        if (inputTimeout != null)
            clearTimeout(inputTimeout);
        inputTimeout = setTimeout(function() {
            inputTimeout = null;
            // Suchbegriffe in die Anfrage übergeben
            query = '?query=' + publaryQuery.value;
            // Liste aktualisieren
            publaryRefreshList();
            // Tabauswahl entfernen
            $('.nav-tabs a.nav-link:not(.dropdown-toggle)').removeClass('active');
        }, 500);
    });

    /* Erstansicht laden */
    var hash = '#' + location.hash.replace('#', ''), // Anker der URL erhalten -> '#' erst entfernen, weil nicht alle Browser dies inkludieren
        def  = true;                                 // kein Anker in URL = true
    $('.nav-tabs a:not(.dropdown-toggle):not(.switch-list)').each(function() {
        if ($(this).attr('href') == hash) {
            def = false;
            $(this).click();
        }
    });
    if (def)
        $('.nav-tabs a:not(.dropdown-toggle)').first().click();
});
