<?php
    require_once('setup.inc');
    // alle Jahre mit Veröffentlichungen aus der Datenbank erhalten
    $url   = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http')
             . '://' . $_SERVER['SERVER_NAME']
             . dirname($_SERVER['SCRIPT_NAME'])
             . '/'.PUBLARY_ROOT_PATH.'ajax/pub-years.php';
    $years = json_decode(file_get_contents($url), true);
    $counter_visible = 0;
    $counter_dropdown = 0;
?>
<div id="publary-main">
    <div id="publary-filter" class="mt-2">
        <ul class="nav nav-tabs" role="tablist">
            <?php
                foreach($years as $year => $count)
                {
                    $counter_visible++; 
                    print ' <li class="nav-item">
                                <a class="nav-link'.($counter_visible==1?' active':'').'" data-toggle="tab" href="#'.$year.'" role="tab" aria-selected="true">'.$year.'</a>
                            </li>';
                    if ($counter_visible == 3) break;
                }
            ?>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Mehr
                </a>
                <div class="dropdown-menu">
                    <?php
                        foreach($years as $year => $count)
                        {
                            $counter_dropdown++;
                            if ($counter_dropdown < $counter_visible) continue;
                            print '<a class="dropdown-item" href="#'.$year.'">'.$year.'</a>';
                        }
                    ?>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#diss">Dissertationen</a>
                </div>
            </li>
            <li class="nav-item">
                <div class="non-nav search">
                    <div class="text-muted">
                        <i class="fas fa-search"></i>
                        <input type="text" id="publary-filter-query" class="border-0 rounded bg-light text-muted" placeholder="">
                    <div>
                <div>
            </li>
            <li class="nav-item">
                <div class="non-nav text-muted">
                    <a class="switch-list text-muted" href="#">
                        <span class="brief-list"><i class="fas fa-bars"></i></span>
                        <span class="full-list d-none"><i class="fas fa-align-justify"></i></span>
                    </a>
                </div>
            </li>
        </ul>
    </div>
    <div class="tab-content border border-top-0" style="min-height: <?php print(2*count($years)); ?>em;">
        <ul id="publary-list">
        </ul>
    </div>
</div>
<script src="publary/publary.js"></script>

