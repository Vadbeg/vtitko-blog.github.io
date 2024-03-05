---
layout: post
title: Make Your Python Code Cleaner in One Easy Step
---


Everybody knows that code needs to be understandable and easy to read. But at the same time, everybody forgets to write typings, sort imports, or follow PEP8. There is a solution — [pre-commit](https://pre-commit.com/).

This tool will trigger different hooks every time you commit your code. So, let’s integrate it into our project.

## Installation

Let's install pre-commit into the environment

`pip install pre-commit`

Then we need to add two files to the root directory of your project

`.pre-commit-config.yaml`

{% highlight yaml %}exclude: _pb2\.py$
repos:
- repo: https://github.com/psf/black
  rev: 22.3.0
  hooks:
    - id: black
      args: [ --skip-string-normalization ]
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.0.1
    hooks:
    - id: check-docstring-first
    - id: check-json
    - id: check-merge-conflict
    - id: check-yaml
    - id: debug-statements
    - id: end-of-file-fixer
    - id: trailing-whitespace
    - id: requirements-txt-fixer
- repo: https://github.com/pre-commit/pygrep-hooks
  rev: v1.9.0
  hooks:
  - id: python-check-mock-methods
  - id: python-use-type-annotations
- repo: https://github.com/pre-commit/mirrors-mypy
  rev: 'v0.910'
  hooks:
  - id: mypy
    args: [--ignore-missing-imports, --warn-no-return, --warn-redundant-casts, --disallow-incomplete-defs]
    additional_dependencies: [types-all]
- repo: https://github.com/PyCQA/isort
  rev: 5.9.3
  hooks:
    - id: isort
      args: [ --profile, black, --filter-files ]
{% endhighlight %}

`pyproject.toml`

{% highlight yaml %}[tool.black]
line-length = 88
target-version = ["py38"]

[tool.isort]
profile = "black"
multi_line_output = 3
{% endhighlight %}


And now, you have to install the hooks that you’ve added.

`pre-commit install`

## Usage

`git commit -m "new brave code"`

Yep, that’s it. Now, every time you’ll commit your code, those hooks will trigger. And automatically:

- sort imports
- format code for PEP8
- check the correctness of your yaml and json files

And mypy will not pass your code if it’s not statically typed. So you’ll have to use typings in the right way.

## Explanation

In the `.pre-commit-config.yaml` file, you specify which hooks you will use. For example, in the provided file, we use [black](https://github.com/psf/black) code formatter of version 22.3.0. And ask not to change `‘` to `"` using a `--skip-string-normalization` flag. 

In the `pyproject.toml` you specify parameters for those individual hooks. For example, you set the maximum line length to 88.
