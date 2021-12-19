# searchable-inputs
Searchable Inputs for HTML by [tmbocheeko](https://www.twitter.com/tmbocheeko_).

See it in action [here](https://jsfiddle.net/tmbocheeko/j5crh3od/latest).

## Using this in your project

### Import searchable-inputs
Use jsDelivr to import this into your project!

CSS _(Put this in your `<head>`)_

```html
<link href="https://cdn.jsdelivr.net/gh/tmbocheeko/searchable-inputs@v1.1/styles.css" rel="stylesheet" type="text/css" />
```

Javascript _(Put this in your `<body>`)_:

```html
<script src="https://cdn.jsdelivr.net/gh/tmbocheeko/searchable-inputs@v1.1/script.js" crossorigin="anonymous" defer></script>
```
### Use it in your HTML

Example _(normally aligned)_:

```html
  <div class="si-container">
    <div id="yourIDHere" class="si-searchable-input"></div>
    <div class="si-option-container">
      <div class="si-option-list" for-si-input="yourIDHere">
        <p class="si-option">Option Text</p>
      </div>
    </div>
  </div>
```

Example _(centered)_:

```html
  <div class="si-container si-centered">
    <div id="yourIDHere2" class="si-searchable-input"></div>
    <div class="si-option-container">
      <div class="si-option-list" for-si-input="yourIDHere2">
        <p class="si-option">Option Text</p>
      </div>
    </div>
  </div>
```

## Additional Classes

`white-arrow`: White dropdown arrow for the input box. Added to the input (div with the class `si-searchable-input`.)

`si-centered`: Centers the input element and option list within the parent element.

## Javascript Functions

`newSIInput(id, options, centered)` —
- **id** _(String)_: The id for the input element and the `for-si-input` attribute on the `option-list` element.
- **options** _(String or Array)_: Either a single option (string) or list of options (array) to populate the input with.
- **centered** _(True/False, Optional)_: Makes the input element and option list centered within the parent element.

`newSIOption(id, options, centered)` —
- **id** _(String)_: The id for the input element to add an option to.
- **option** _(String or Array)_: Either a single option (string) or list of options (array) to add to the input.
