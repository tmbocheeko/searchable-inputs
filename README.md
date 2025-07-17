# searchable-inputs
Searchable Inputs for HTML by [tmbocheeko](https://www.twitter.com/tmbocheeko_).

See it in action [here](https://codepen.io/tmbocheeko/pen/OJzwqXJ).

## Using this in your project

### Import searchable-inputs
Use jsDelivr to import this into your project!

CSS _(Put this in your `<head>`)_

```html
<link href="https://cdn.jsdelivr.net/gh/tmbocheeko/searchable-inputs@v1.7.2/searchableinputs.css" rel="stylesheet" type="text/css" />
```

Javascript _(Put this in your `<body>`)_:

```html
<script src="https://cdn.jsdelivr.net/gh/tmbocheeko/searchable-inputs@v1.7.2/searchableinputs.js" crossorigin="anonymous"></script>
```
### Use it in your HTML

Example _(normally aligned)_:

```html
  <div class="si-container">
    <input id="yourIDHere" class="si-input" autocomplete="off">          // Make sure to replace yourIDHere
    <div class="si-option-container">
      <div class="si-option-list" for-si-input="yourIDHere">             // on both of these lines!
        <p class="si-option">Option Text</p>
      </div>
    </div>
  </div>
```

Example _(centered)_:

```html
  <div class="si-container si-centered">
    <input id="yourIDHere" class="si-input" autocomplete="off">          // Make sure to replace yourIDHere
    <div class="si-option-container">
      <div class="si-option-list" for-si-input="yourIDHere">             // on both of these lines!
        <p class="si-option">Option Text</p>
      </div>
    </div>
  </div>
```

## Additional Classes

`si-white-arrow`: White dropdown arrow for the input box, useful for darker input backgrounds. Added to the input.

`si-no-arrow`: Removes the arrow from the input box. Added to the input.

`si-input-dark`: Changes the input's background to dark and automatically uses the white arrow. Added to the input.

`si-centered`: Centers the input element and option list within the parent element. Added to the parent div of the input.

`si-option-hidden`: Text for the option that will be searched through, but not diplayed. Added to a child element of the option, typically applied via `newSIOption()` or `newSIInput()` in a span.

## Event Listener

The event listener is applied to the input (`.si-input`) element.

`sivalueconfirmed`: Triggers event when the value is confirmed.
- **event.detail.value** _(String)_: The confirmed value, respecting all innerText of that option.
- **event.detail.method** _(String)_: The method of confirming. Returns either `click` or `enter`.


## Javascript Functions

`newSIInput(id, options, centered)`: Returns an element containing a new input with the given id and option list.
- **id** _(String)_: The id for the input element and the `for-si-input` attribute on the `option-list` element.
- **options** _(String or Array)_: Either a single option (string) or list of options (array) to populate the input with.
- **centered** _(True/False, Optional)_: Makes the input element and option list centered within the parent element.

`newSIOption(id, options, centered)`: Appends a new option to an existing input.
- **id** _(String)_: The id for the input element to add an option to.
- **option** _(String or Array)_: Either a single option (string) or list of options (array) to add to the input.

`loadSI()`: Reloads all the options and inputs. Previously required to be used after running any other function; is now built in to them instead. Remains in for legacy support.
