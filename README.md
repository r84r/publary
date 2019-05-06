# publary

#### Publary is an easy to implement scientific publication list include for webpages

Above the list, the publication years represented in tabs, a detail view toogle and a search query are placed. Every year-tab or search query are updated through an ajax request. The list can be toggled between a brief and a detailed view. In the brief view only the title, authors and links/download are shown. Additionally the publication type and the journal/book/etc. are presented in the detailed view. If the publication data contain keywords or a abstract the list item can be expanded by clicking on the title.

This include was written for a website of a professorship. Therefor comments in the code are mostly written in German due to maintenance reasons.

## Minimum Requirements

- PHP 5.4 server (not tested below)
- Bootstrap 3 or 4
- JQuery 1.11.3 (normally requiered by Bootstrap)
- Font Awesome 5 (Javascript version)
- write rights for the script `publary/build-db.php` and the folder `publary/database/`

## Include Template

### Bootstrap 4

```html
<head>
    ...
    <script defer src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script defer src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>
    ...
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="publary/publary.css">
    ...
</head>
<body>
    ...
    <div class="some-wrapper">
        <?php require_once('publary/publary.php'); ?>
    </div>
    ...
</body>
```

### Bootstrap 3

```html
<head>
    ...
    <script defer src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>
    ...
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="publary/publary.css">
    ...
</head>
<body>
    ...
    <div class="some-wrapper">
        <?php require_once('publary/publary-b3.php'); ?>
    </div>
    ...
</body>
```
