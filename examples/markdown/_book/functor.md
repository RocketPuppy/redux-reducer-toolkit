# Functor

#### 1\. Motivation

It is often the case when programming that you have a function that
takes some input argument and returns a transformed output. You also
might have some piece of data you'd like to apply that function to, but
you can't because the data is encapsulated inside something else. We'll
call the "data" in this case the "target" and the "something else" the
"context". To make it concrete, we might have some way to get the number
of completed todo items but the only way to get the todo items is via a
selector function.

{introduction\_concrete [1](functor.html#1:1)}

``` prettyprint
const todoSelector = (state, props) => state.todos;

const lengthOfTodos = (todos) => todos.length;
```

Note how you can't just apply the `lengthOfTodos` function to the
`todoSelector`. The `lengthOfTodos` function expects an array of todo
objects, and the `todoSelector` is a function. This is where Functor
comes to help. With Functor you can define that `lengthOfTodos` is to be
applied to the target data in the context of the selector function. This
is what it looks like.

{introduction\_concrete [1](functor.html#1:1)} +=

``` prettyprint
Functor.map(lengthOfTodos, todoSelector)
```

Simple\!

#### 2\. Details

A Functor is really best talked about as an interface that an entity can
implement. That interface is pretty simple. It is simply the map
function, along with some properties on how that function behaves. The
specification is below.

{details [2](functor.html#1:2)}

``` prettyprint
const Functor = {
  map: function(transformer, context) {
    {implementation, 2}
  }
};
```

Added to in section [2](functor.html#1:2)

It takes a transformer function and the context as arguments. It must
also return a value that is in the same context. You'll see what that
means in the implementation.

The map function has a few properties that make it convenient to work
with. The first property is called the Identity property. It simply says
that if your transformer is the identity function, the target doesn't
change.

{details [2](functor.html#1:2)} +=

``` prettyprint
const identity = x => x;

Functor.map(identity, todoSelector) === todoSelector;
```

Added to in section [2](functor.html#1:2)

The second property is known as the Composition property. This property
says that if you have two transformers you'd like to apply to a target,
applying the composition of those transformers is the same as applying
each transformer individually one after the other.

{details [2](functor.html#1:2)} +=

``` prettyprint
{compose, 3}
const transformerA = todos => todos.emptyTodos;
const transformerB = todos => todos.length;

Functor.map(compose(transformerB, transformerA), todoSelector) ===
    Functor.map(transformerB, map(transformerA, todoSelector));
```

Added to in section [2](functor.html#1:2)

The consequence of this is that you don't need to worry about how you
call `map` when you have multiple transformations. You can call it once,
twice, or as many times as makes sense. You can also always refactor so
you build up one large transformer pipeline and only call map once.

The implementation is relatively simple, but can be tricky if you aren't
used to functional programming or the Functor concepts. Remember that
our context is selector functions, which have a specific shape.

{implementation [2](functor.html#1:2)}

``` prettyprint
return (state, props) =>
    transformer(context(state, props));
```

It needs to return a value in the same context, so the return value is a
selector function that takes state and props as arguments. That returned
function though, applies the transformer that was passed into map to the
returned value of evaluating the context with the given state and props.
Thus we get a new context that contains the transformed value.

This does obey the laws, but I leave it as an exercise to the reader to
reason through them and prove it themselves.

#### 3\. Appendix

The definition of compose used here is as follows.

{compose [3](functor.html#1:3)}

``` prettyprint
const compose = (f, g) => (...args) => f(g(...args))
```

Used in section [2](functor.html#1:2)

  
