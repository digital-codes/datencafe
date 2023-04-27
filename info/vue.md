# Stroy starting

##problem

starting is triggered twice

## observations

titlebar is created and mount for every component, 7 in tools

each detect the route change

within workflow however, there is only one titlebar (as expected)

every titlebar is detecting twice, e.g. 2 route change events are triggered per
change, total messages is 14, once all pages have been visited

number grows when more menu items have been actuvated, up to 7

# Lock Chart

position: fixed;
z-index: 100;
top: 150px;
background: red;

icons: lock, lock-open

