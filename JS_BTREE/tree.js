// BTREE library for implicit heap array representation
// Designed and optimized for external memory model
// Data Model:
//  - each array element is an object that contain B keys
//  - each array element represent a tree node
//  - each tree node have B+1 childs

// TODO: actually we assume to manage numbers keys (future generic object implementation)
var BTREE = function(B) {

    // number of node keys
    var b = B;
    // implicit tree representation
    var result = [];
    // input ref (Array)
    var input = null;

    // move to the index of the first child of the destination node (parent)
    var firstChild = function(i) {
        return i - ((i-1) % (b+1))
    };

    // return the tree height
    var height = function() {

        if (input === null) {
            return 0;
        }
        var j=0, h=0;
        while (j < input.length) {
            j = j + Math.pow(B+1, h)*B;
            h++;
        }

        return h;
    };

    // return the index of the first element in the level h
    // levels are count from 0 to n (root is level 0)
    var firstNodeIndex = function(p) {
        return (Math.pow(B+1, p) - 1) / B;
    };

    return {
        // return the index of the parent node
        // the jump is made every time from the first child of the destination node
        parent: function(i) {
            return Math.ceil( (b*firstChild(i)-b-2) / (b*(b+1)) );
        },
        // return the index of k-th child node (1<=k<=b+1)
        child: function(i, k) {
            return i*b+i+k;
        },
        // store and return a new array that is a btree implicit representation of the input array
        // warning: the array is a shallow copy, this securely work for primitive type (actually we support only numbers keys)
        build: function(source) {
            // make a shallow copy
            input = source.slice();
            // sort
            input.sort(function(a,b){
                return a-b;
            });
            // necessary tree height
            var h = height();
            // array levels starting indices (from 0 to h-1)
            var indices = [];
            for (var i=0; i<h; i++) {
                indices.push(firstNodeIndex(i));
            }

            var inputIndex = 0, currentLevel = h-1;
            while (inputIndex < input.length) {

                // make leaf node
                var leaf = input.slice(inputIndex, inputIndex+B);
                // add to result array (tree)
                var leafIndex = indices[currentLevel];
                result[leafIndex] = leaf;
                // move the input pointer
                inputIndex = inputIndex + B;
                // check if we have others keys
                if (inputIndex > input.length-1) {
                    // special case (parent not exist) we cannot made it we have no more keys
                    if (typeof(result[this.parent(leafIndex)]) === 'undefined') {
                        // the leaf is moved to the parent index
                        result[this.parent(leafIndex)] = leaf;
                        result.splice([leafIndex], 1);
                    }
                    return result;
                }
                // move the level index
                indices[currentLevel]++;

                // find parent index and add the next key to it
                var found = false;
                while (currentLevel >= 0 && !found) {

                    // move to parent level
                    currentLevel--;
                    // find parent node
                    var node = result[indices[currentLevel]];
                    // check if exist, is full or have space to another keys
                    if (typeof(node) === 'undefined') {
                        // create parent node
                        result[indices[currentLevel]] = [input[inputIndex]];
                        inputIndex++;
                        found = true;
                    } else if (node.length < B) {
                        // push new keys inside parent
                        node.push(input[inputIndex]);
                        inputIndex++;
                        found = true;
                    } else if (node.length === B) {
                        // this parent is full move level pointer to the next index
                        // next loop inspect the parent of the current parent
                        indices[currentLevel]++;
                    }

                }

                // console.log(JSON.stringify(result));

                // repeate from leaf level
                currentLevel = h-1;                

            }

            return result;
        }
    }

};

// EXAMPLE
var tree = BTREE(3);
var input = [1,3,4,5,6,9,10,2,7,8,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
var arr = tree.build(input)
console.log(JSON.stringify(arr));