---
cover: "../../assets/blog/ensuring-type-safety-with-pythons-argument-matching-decorators/cover.svg"
coverAlt: "Ensuring Type Safety with Python’s Argument Matching Decorators"
title: "Ensuring Type Safety with Python’s Argument Matching Decorators"
publicationDate: 2024-07-31
description: "In the world of Python, type safety and correctness are critical for developing robust software. Python’s dynamic nature can sometimes lead to bugs that are hard to trace. Fortunately, with the advent of type hints and type checkers like mypy, developers can now catch many of these issues before runtime. One such advancement in type hinting is the use of argument-matching decorators, which ensure that functions and methods have compatible signatures. In this blog post, we'll explore how these decorators work, how to use them, and why they are beneficial."
layout: '../../layouts/MarkdownLayout.astro'
---

# Introduction

In the world of Python, type safety and correctness are critical for 
developing robust software. Python’s dynamic nature can sometimes lead to bugs 
that are hard to trace. Fortunately, with the advent of type hints and type 
checkers like `mypy`, developers can now catch many of these issues before 
runtime. One such advancement in type hinting is the use of argument-matching 
decorators, which ensure that functions and methods have compatible signatures. 
In this blog post, we'll explore how these decorators work, how to use them, 
and why they are beneficial.

Full code example can be found [here](https://gist.github.com/ic-it/481f9f64d8db5d2e010ef51772268248)

# The Problem: Matching Function and Method Signatures

When working with higher-order functions, method wrappers, or code that 
involves multiple function calls, it is essential to ensure that the functions 
and methods involved have compatible signatures. Mismatched arguments can lead 
to subtle bugs that are difficult to debug.

For example, consider a scenario where you have a method in a class that needs 
to call a standalone function or another method. If the method signature 
changes or is mismatched, it can lead to runtime errors that are hard to 
pinpoint. To prevent this, we can use decorators that enforce matching argument lists.

# The Solution: Argument Matching Decorators

In Python, we can leverage type hinting to ensure that function and method 
signatures align properly using argument-matching decorators. Here’s a look at 
four such decorators:

## 1. `match_args_mm`

This decorator is used to match the argument lists of two methods within the 
same class. It ensures that one method has the same arguments as another method.

**Usage Example:**
```python
class Test:
    def test3(self, a: int, b: int, c: str) -> int:
        raise NotImplementedError

    @match_args_mm(test3)
    def test4(self, *args: typing.Any, **kwargs: typing.Any) -> str:
        return str(self.test3(*args, **kwargs))
```

In this example, `test4` must have the same arguments as `test3`.

## 2. `match_args_ff`

This decorator is used to match the argument lists of two functions. It 
ensures that the arguments of one function match those of another function.

**Usage Example:**
```python
def test1(a: int, b: int, c: str) -> int:
    raise NotImplementedError

@match_args_ff(test1)
def test2(*args: typing.Any, **kwargs: typing.Any) -> str:
    return str(test1(*args, **kwargs))
```

Here, `test2` must match the argument signature of `test1`.

## 3. `match_args_fm`

This decorator helps match the arguments of a function with those of a method. 
It is useful when you want to ensure that a method's arguments align with a 
standalone function.

**Usage Example:**
```python
def test1(a: int, b: int, c: str) -> int:
    raise NotImplementedError

class Test:
    @match_args_fm(test1)
    def test5(self, *args: typing.Any, **kwargs: typing.Any) -> str:
        return str(test1(*args, **kwargs))
```

In this case, `test5`’s arguments must align with `test1`.

## 4. `match_args_mf`

This decorator is used to match the arguments of a method with a function. It 
ensures that a function's signature is compatible with a method's signature.

**Usage Example:**
```python
class Test:
    def test3(self, a: int, b: int, c: str) -> int:
        raise NotImplementedError

@match_args_mf(Test.test3)
def test6(*args: typing.Any, **kwargs: typing.Any) -> str:
    return str(Test.test3(*args, **kwargs))
```

With `test6`, we ensure that the function's arguments match those of `Test.test3`.

# How These Decorators Work

Let's look at the most complicated decorator, since the others work on 
roughly the same principle.

## Understanding `match_args_mm`

Here’s the `match_args_mm` decorator in its full glory:

```python
def match_args_mm(
    f: typing.Callable[
        typing.Concatenate[_T, _P],
        _U,
    ]
) -> typing.Callable[
    [
        typing.Callable[
            typing.Concatenate[_V, _Q],
            _W,
        ]
    ],
    typing.Callable[
        typing.Concatenate[_V, _P],
        _W,
    ],
]:
    """
    Match the arguments of two methods.

    method -> method

    !!! This is a type hinting function only. It does not perform any runtime operations.
    """

    def decorator(
        g: typing.Callable[
            typing.Concatenate[_V, _Q],
            _W,
        ]
    ) -> typing.Callable[
        typing.Concatenate[_V, _P],
        _W,
    ]:
        return g  # type: ignore

    return decorator
```

This decorator takes a method `f` as an argument and returns a decorator that
takes another method `g` as an argument. The goal is to ensure that the
arguments of `f` and `g` match.

Problem is that the `self` argument of the `f` method is generally not the same
as the `self` argument of the `g` method. 

**Lets break down the type hints:**
- `_T` and `_V` are type variables representing the self argument of the methods.
- `_U` and `_W` are type variables representing the return type of the methods.
- `_P` and `_Q` are param specs representing the arguments of the methods.

In this decorator, we want to separate the `self` arguments from the rest of the
arguments and swap just the rest of the arguments between the two methods.  
So using the `typing.Concatenate` type hint, we can achieve this. You can find
`typing.Concatenate` described in the [Python documentation](https://docs.python.org/3/library/typing.html#typing.Concatenate).

# Benefits of Using Argument Matching Decorators

1. **Enhanced Type Safety**: By ensuring that function and method signatures 
    are consistent, these decorators help catch potential mismatches early 
    in the development process.

2. **Improved Code Reliability**: With consistent argument lists, you reduce 
    the risk of runtime errors due to incorrect arguments.

3. **Better Documentation**: Type hints serve as a form of documentation, 
    making the codebase easier to understand and maintain.

4. **Integration with Type Checkers**: Tools like `mypy` can leverage these 
    type hints to perform static type checking, improving overall code quality.

# Conclusion

Argument-matching decorators offer a powerful way to enforce consistency in 
function and method signatures within Python code. They leverage Python’s type 
hinting system to ensure that functions and methods interact correctly, 
reducing the risk of runtime errors and improving code reliability. By 
incorporating these decorators into your codebase, you can achieve better type 
safety and maintainability in situations where other approaches might fall short
or be too cumbersome and verbose. I realize that the more reliable way is to 
stupidly duplicate signatures, but sometimes that can be quite inconvenient.

Happy coding, and may your functions always match their methods!

---

Feel free to leave comments or questions below, and don't forget to check out 
the code example provided to see these decorators in action.
