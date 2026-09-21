---
title: Python code style
type: reference
provenance: human-checked
inFlux: "Code style section for FreeMoCap core is a work in progress for version alpha. It's expected to stabilize by beta."
history:
  - date: "2026-08-26"
    against: "freemocap v2.0.0-alpha.21: .pre-commit-config.yaml (black 22.6.0 hook), .flake8, CONTRIBUTING.md, pyproject.toml/poe_tasks.toml (ruff, pytest), CI workflow, and source spot-checks for docstring/type-hint/naming conventions"
  - date: "2026-08-19"
    against: "v1 (ported, not yet re-checked against v2)"
---
# Python code style guide  
This style guide aims to maintain code readability, quality, and maintainability. 
  
## General guidelines  

- Follow a [Universal Design](https://uxdesign.cc/the-curb-cut-effect-universal-design-b4e3d7da73f5) approach that aspires to be interpretable to the widest possible number of people 
- Follow  [PEP 8 Guidelines](https://peps.python.org/pep-0008/)
- Follow standard best practices, for example [SOLID](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design), and so on
- Use  [Black](https://black.readthedocs.io/en/stable/) to auto-format your code

## Specific guidelines

1. **Include Google-formatted docstrings**: use Google-style docstrings for functions, methods, and classes to provide clear and concise documentation.  
  
2. **Type hints**: use input and return type hints for functions and methods to improve code readability and facilitate better tooling support.  
  
3. **Keyword arguments**: prefer using keyword arguments over simple arguments for functions and methods to improve code clarity.  
  
4. **Private methods and attributes**: use leading underscores to denote private methods and attributes in classes, and use `@property` decorators when appropriate.  
  
5. **Descriptive names**: use full words in variable and class names instead of abbreviations (for example, `database` instead of `db`).  
  
6. **PEP8 and `black` formatting**: follow PEP8 and `black` code formatting guidelines to maintain consistency and readability.  
  
7. **Consistent naming conventions**: adopt consistent naming conventions for variables, functions, and classes.  
   - Use `snake_case` for variables and functions (for example, `my_variable`, `my_function`)  
   - Use `PascalCase` for class names (for example, `MyClass`)  
   - Use `UPPERCASE` for constants (for example, `MY_CONSTANT`)  
  
8. **Keep functions and methods short**: aim to keep functions and methods concise, ideally not exceeding 15-20 lines of code.  
  
9. **Modularize code**: organize code into modules and packages to maintain a clean and organized codebase.  
  
10. **Minimal comments**: avoid comments if possible. Write code that is simple and descriptive (See pt 5) enough that comments are  not necessary. If needed, use comments sparingly to provide context or explain complex or non-obvious sections of your code.  
  
11. **Error handling**: use appropriate error handling techniques, such as `try` and `except` blocks, to handle exceptions and provide meaningful error messages to users.  
  
12. **Write tests**: write unit tests to ensure the correct functioning of your code.  
  
13. **Code reviews**: perform code reviews with team members or peers to maintain a high-quality codebase.
