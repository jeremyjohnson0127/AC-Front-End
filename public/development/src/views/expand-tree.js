/* Expandable tree v.1.0 */
function expandTree(d3, treedata, elementselector, updateSub,treelegth) {
  // tree hierachy
  var root = treedata;
  var i = 0,
    duration = 750,
    rectW = 300,
    rectH = 50; //sizeof the rectangle

  var tree = d3.layout.tree().nodeSize([70, 40]);
  var diagonal = d3.svg.diagonal().projection(function(d) {
    return [d.x + rectW / 2, d.y + rectH / 2];
  });

  var svg = d3
    .select("#" + elementselector)
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    //.attr("preserveAspectRatio", "xMinYMin meet")
    //.attr("viewBox", "0 0 600 400")
    //.attr("width", 500)
    .attr("height", 150 * treelegth) //height of the tree
    .call(responsivefy)
    .append("g");
  function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;
    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMinYMid")
      .call(resize);
    d3.select(window).on("resize." + container.attr("id"), resize);
    // get width of container and resize svg to fit it
    function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    }
  }
  root.x0 = 0;
  root.y0 = 0;

  update(root);

  //d3.select("#" + elementselector).style("height", "600px");

  function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);
    // Normalize for fixed-depth.
    nodes.forEach(function(d, index) {
      //console.log(elementselector,'depth', d);
      let generalgain = 0;
      let previous = d.depth > 0 ? nodes[index+1].name : d.name;
      let singlegain = stringChecker(previous);
      generalgain += singlegain;
      console.log(d.name, ' ', d.depth, index, previous);
      d.y = d.depth * 135; // path from one node to another
    });
    function stringChecker(string) {
      // console.log('string length', string.length);
      let detect = string.length / 50;
      return detect > 1 ? detect : 1;
    }
    // Update the nodes…
    var node = svg.selectAll("g.node").data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
      })
      .on("click", click);

    nodeEnter
      .append("rect")
      .attr("width", rectW)
      .attr("height", function(d){
        let mainheight = stringChecker(d.name) > 1 ? 100 : rectH;
        //console.log('mainheight', d.name, mainheight);
        return mainheight;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("fill", function(d) {
        return d._children ? "#9e9e9e" : "#fff";
      });

    nodeEnter
      .append("foreignObject")
      .attr("width", function() {
        return rectW;
      })
      .attr("height", function(d) {
        let subheight = stringChecker(d.name) > 1 ? 100 : rectH;
        //console.log('subheight', d.name, subheight);
        return subheight;
      })
      .append("xhtml")
      .html(function(d) {
        return `<div class="node-text wordwrap text-center">${d.name} </div>`;
      });

    // Transition nodes to their new position.
    var nodeUpdate = node
      .transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    // nodeUpdate
    //   .select("rect")
    //   .attr("width", rectW)
    //   .attr("height", rectH)
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 1)
    //   .style("fill", function(d) {
    //     return d._children ? "#9e9e9e" : "#fff";
    //   });

    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + source.x + "," + source.y + ")";
      })
      .remove();

    nodeExit
      .select("rect")
      .attr("width", rectW)
      .attr("height", rectH)
      //.attr("width", bbox.getBBox().width)""
      //.attr("height", bbox.getBBox().height)
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    nodeExit.select("text");

    // Update the links…
    var link = svg.selectAll("path.link").data(links, function(d) {
      return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("x", rectW / 2)
      .attr("y", rectH / 2)
      //.attr('marker-end', 'url(#end-arrow)')
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link
      .transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children on click.
  function click(d) {
    if (elementselector == "tree-container") {
      updateSub(d);
    }
    if (d.children) {
      // close
      // d._children = d.children;
      // d.children = null;
    } else {
      // collapse
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
  $('[data-toggle="popover"]').popover();
} //end expand tree

function flatToHierarchy(all) {
  // degenerate binary tree, accepts object array
  const helper = all.reduce(
    (h, o) => ((h[o._id] = Object.assign({}, o)), h),
    Object.create(null)
  );
  const tree = all.reduce((t, node) => {
    const current = helper[node._id];
    if (current.parentid === 0) {
      // if it doesn't have a parent push to root
      t = current;
      t.children = [];
    } else {
      helper[node.parentid].children || (helper[node.parentid].children = []); // add the children array to the parent, if it doesn't exist
      helper[node.parentid].children.push(current); // push the current item to the parent children array
    }
    return t;
  }, []);
  return tree;
}
function reset() {
  // Prevent redeclarations
  node.remove();
  link.remove();
  svg.remove();
  nodes = [];
  links = [];
}
export { expandTree, flatToHierarchy, reset };
