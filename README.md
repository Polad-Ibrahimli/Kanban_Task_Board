## Kanban Task Board

# Rendering

Using dom manipulation all elements on web page are caught using query.selector,
since there are 3 different columns, each one should be rendered seperately
using forEach method, this is achieved. Then all tasks in each column is gathered seperately and re-rendered.

## Event manipulation
 Add and cancel buttons are added a click event to make sure that whenever they are clicked modal window is shown/disappearing

 In terms of editing or deleting, we add click event to board and after that we grasp the closest task element to the board to display its contents in modal window

 Dragging happens through the use of four different events, namely, drag-start,drag-end, drag-over,drag-leave


Saving to local storage enables to see the tasks created even before the refresh

Filtering uses re-rendering after anything is typed in the input