# searchable-inputs
Searchable Inputs for HTML by [tmbocheeko](https://www.twitter.com/tmbocheeko_).

## Import into your project
Use jsDelivr to import this into your project!

CSS: _(Put this in your `<head>`)_

```html
<link href="https://cdn.jsdelivr.net/gh/tmbocheeko/searchable-inputs@v1.0/stles.css" rel="stylesheet" type="text/css" />
```

JS: _(Put this in your `<body>`)_

```html
<script src="https://cdn.jsdelivr.net/gh/tmbocheeko/searchable-inputs@v1.0/script.js" crossorigin="anonymous" defer></script>
```

## Additional Classes

`white-arrow`: White dropdown arrow for the input box. Added to the input (div with the class `si-searchable-input`.)

`si-centered`: Centers the input element and option list within the parent element.

## Javascript Functions

`newSIInput(id, options, centered)` —
- **id** *(String)*: The id for the input element and the `for-si-input` attribute on the `option-list` element.
- **options** *(String or Array)*: Either a single option (string) or list of options (array) to populate the input with.
- **centered** *(True/False, Optional)*: Makes the input element and option list centered within the parent element.

`newSIOption(id, options, centered)` —
- **id** *(String)*: The id for the input element to add an option to.
- **option** *(String or Array)*: Either a single option (string) or list of options (array) to add to the input.
