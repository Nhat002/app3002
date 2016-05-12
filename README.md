# app3002

#HTML Sanitization

## What is it?
This Golang project does the same work as the ruby gem used in oceanus to sanitize the HTML in cover pages and community walls. From `microcosm\bluemonday` basic policy and function, we build our own policy for specific used.

## Differents with old ruby gems:
Since We allow more protocols:
```sh
	<img> => "src"
	<del> => "cite"
	<ins> => "cite"
	<blockquote> => "cite"
	<q> => "cite"
```
