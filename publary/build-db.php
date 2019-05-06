<?php
    
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

    require_once('setup.inc');

    class bibDatabase
    {
        public const ITEM_PATH = 0;
        public const ITEM_PDF  = 1;

        public $items;

        public function __construct()
        {
            $this->items = [];
        } 

        public function addPath($databasePath)
        {
            $directory = new RecursiveDirectoryIterator(__DIR__.'/'.$databasePath);
            $files     = new RecursiveIteratorIterator($directory);
            foreach ($files as $info)
            {
                $file = $info->getPathname();
                if (preg_match('/(\.bib)$/i', $file))
                {
                    $name      = substr($file, 0, -4);
                    $pdfExists = file_exists($name.'.pdf');
                    $this->items[] = [$name, $pdfExists];
                }
            }
        }

        public function getPdfFiles() {
            $files = [];
            foreach ($this->items as $item)
            {
                if ($item[self::ITEM_PDF])
                {
                    $files[] = $item[self::ITEM_PATH].'.pdf';
                }
            }
            if (count($files) == 0)
            {
                return false;
            } else {
                return $files;
            }
        }
        
        public function getMissingPdfFiles() {
            $files = [];
            foreach ($this->items as $item)
            {
                if ($item[self::ITEM_PDF] == false)
                {
                    $files[] = substr($item[self::ITEM_PATH], strlen(__DIR__.'/'));
                }
            }
            if (count($files) == 0)
            {
                return false;
            } else {
                return $files;
            }
        }

    }

    require_once('bibtex-parser\src\Exception\ExceptionInterface.php');
    require_once('bibtex-parser\src\Exception\ParserException.php');
    require_once('bibtex-parser\src\Processor\TagNameCaseProcessor.php');
    require_once('bibtex-parser\src\Processor\TagSearchTrait.php');
    require_once('bibtex-parser\src\Processor\TagCoverageTrait.php');
    require_once('bibtex-parser\src\Processor\NamesProcessor.php');
    require_once('bibtex-parser\src\Processor\KeywordsProcessor.php');
    require_once('bibtex-parser\src\ListenerInterface.php');
    require_once('bibtex-parser\src\Listener.php');
    require_once('bibtex-parser\src\Parser.php');
    use RenanBr\BibTexParser\Parser;
    use RenanBr\BibTexParser\Listener;
    use RenanBr\BibTexParser\Processor\TagNameCaseProcessor;
    use RenanBr\BibTexParser\Processor\NamesProcessor;
    use RenanBr\BibTexParser\Processor\KeywordsProcessor;
    use RenanBr\BibTexParser\Exception\ParserException;
    use RenanBr\BibTexParser\Exception\ProcessorException;
    
    /*
     *  Declare variables
     */
    $literature = [];
    $lastFile   = '';
    $error      = false;
        
    /*
     *  Read files database
     */
    $bibDB = new bibDatabase();
    $bibDB->addPath(PUBLARY_BIB_PATH);
    $pdfFiles = $bibDB->getPdfFiles();
    /* Result output */
    $missing = count($bibDB->items) - count($bibDB->getPdfFiles());
    print('<strong>'.count($bibDB->items).'</strong> BibTex file(s) were <strong>found</strong>.<br>');
    if ($missing > 0)
    {
        print('<br><strong>'.($missing).'</strong> PDF file(s) were <strong>missing</strong>:<br>');
        foreach($bibDB->getMissingPdfFiles() as $file)
        {
            print('<code>[ ] '.str_replace('\\', ' \\ ',
                               str_replace('\2', '\<b2r><strong style="color:maroon">2', 
                               str_replace('\1', '\<b2r><strong style="color:maroon">1', $file))).'</strong></code><br>');
        }
    }
    
    /*
     *  Parse BibTex files
     */
    print('<br>');
    try
    {
        /* Initialize the BibTex parser */
        $bibParser   = new Parser();
        $bibListener = new Listener();
        $bibListener->addProcessor(new TagNameCaseProcessor(CASE_LOWER));
        $bibListener->addProcessor(new NamesProcessor());
        $bibListener->addProcessor(new KeywordsProcessor());
//        $bibListener->addProcessor(function (array $entry) {
//            /* Add file information to literature array */
//            $entry['path'] = substr($GLOBALS['lastFile'], strlen(__DIR__)+1, -4);
//            return $entry;
//        });
        $bibParser->addListener($bibListener);
        /* Process bib-files */
        foreach($bibDB->items as $file)
        {
            $lastFile = $file[bibDatabase::ITEM_PATH] . '.bib';
            $bibParser->parseFile($lastFile);
        }
        /* Get processed data from the Listener */
        $literature = $bibListener->export();
        // Process every entry
        for($i = 0; $i < count($literature); $i++)
        {
            // Add path to data;
            $path = substr($bibDB->items[$i][bibDatabase::ITEM_PATH], strlen(__DIR__)+1);
            $path = str_replace('/', '\\', $path);
            $literature[$i]['bibpath'] = $path . '.bib';
            if ($bibDB->items[$i][bibDatabase::ITEM_PDF])
                $literature[$i]['pdfpath'] = $path . '.pdf';
            // Delete bib-content entry
            unset($literature[$i]['_original']);
            if (!isset($literature[$i]['year']))
            {
                print('Year is missing: ' . $path . '<br>');
            }
        }
    }
    catch (ParserException $exception)
    {
        $error = 'BibTex file is not valid: <strong>'.$lastFile.'</strong>';
    }
    catch (ProcessorException $exception)
    {
        $error = 'Data of BibTex file can not be processed: <strong>'.$lastFile.'</strong>';
    }

    
    /*
     *  Save array containing literature data to a JSON file (for fast database loading -> UX)
     *  JSON_PRETTY_PRINT deactived to save space (around 20%) and because it is not necesary
     */
    if ($error === false)
    {
        file_put_contents(PUBLARY_LIB_FILE,
                          json_encode($literature, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        print('<br>Generated <strong>'.PUBLARY_LIB_FILE.'</strong> with '.count($literature).' entries.');
    }
    else {
        print('<br><span style="color:maroon">'.$error.'</span><br>');
    }
?>
