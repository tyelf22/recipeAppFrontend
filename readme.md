# Vanilla JS Recipe App

This app is useful for creating todos, organizing todos, and being sure you have complete control over your todos.

# Application Architecture
    - Frontend hosted on Netlify
    - Backend hosted on Heroku
    - Database: MongoDB

The Backend endpoints are described below 
👇

## Return all todos

### Request
    GET /todos

#### Response

```json
[
    {
        "todo": "Buy Milk",
        "complete": false,
        "category": "Grocery"
    },

    {
        "todo": "Study",
        "complete": false,
        "category": "School"
    }
]
```

## Return specific todo

### Request
    GET /todos/:id

#### Response

```json
{
    "id": "5f98517c972e162358bc9829",
    "todo": "Buy Milk",
    "complete": false,
    "category": "Grocery"
}
```

## Create new todo

### Request
    Post /todos

```json
{
    "todo": "Buy Cheese",
    "complete": false,
    "category": "Grocery"
}
```
    
#### Response

```json
{
    "todo": "Buy Cheese",
    "complete": false,
    "category": "Grocery"
}
```

## Complete Todo

### Request
    Patch /todos/:id

```json
{
    "complete": true,
}
```
    
#### Response

```json
{
    "todo": "Buy Cheese",
    "complete": true,
    "category": "Grocery"
}
```

## Delete Todos

### Request
    Delete /todos/:id

    
#### Response

[Todo was deleted]