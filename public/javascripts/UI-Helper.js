function createLine(x1,y1, x2,y2, parent){
    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)),
        angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI,
        transform = 'rotate('+angle+'deg)',

        line = $('<div>')
        .appendTo(parent)
        .addClass('line')
        .css({
          'position': 'absolute',
          'transform': transform
        })
        .width(length)
        .offset({left: x1, top: y1});

    return line;
}