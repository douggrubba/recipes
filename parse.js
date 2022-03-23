#!/usr/bin/env node

const fs = require('fs')
const markdown = require('markdown').markdown

const convertMarkdown = (inputFile = null, outputDir = null) => {
  if (!inputFile || !outputDir) {
    throw new Error('Both a input file and output directory is needed.')
  }

  if (!dirExistsAndIsWritable(outputDir)) {
    throw new Error('Directory not found.')
  }

  if (parseMarkdown(inputFile, outputDir)) {
    console.log('HTML parsed from markdown.')
  } else {
    console.log('There was a problem parsing the markdown.')
  }
}

const parseMarkdown = (inputFile, outputDir) => {
  const input = `${process.cwd()}/${inputFile}`
  inputFile = inputFile.split('/')
  inputFile = inputFile.pop()
  let output = inputFile.split('.')
  output.pop()
  output = output.pop()
  output = `${outputDir}/${output}.html`

  const content = fs.readFileSync(input, {
    encoding: 'utf8',
    flag: 'r'
  })

  fs.writeFile(output, markdown.toHTML(content), err => {
    if (err) {
      throw new Error('There was a problem writing the html.')
    }
  })

  return true
}

// make sure the output dir exists and writable
const dirExistsAndIsWritable = dir => {
  dir = `${process.cwd()}/${dir}`

  const exists = fs.existsSync(dir)

  fs.access(dir, fs.constants.W_OK, err => {
    if (err) {
      throw new Error('Directory not unwritable.')
    }
  })

  return exists
}

// convert markdown to html and output to a dir
//
// node parse.js test.md output_dir
try {
  convertMarkdown(process.argv[2], process.argv[3])
} catch (e) {
  console.error(e)
}
