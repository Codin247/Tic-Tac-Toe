//////////////////////////////////////////////
//!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!!!!!//
// DO NOT TOUCH THIS!!!!!!!!!!!!!!!!!!!!!!!//
let ips = [];

process.stdin.on('data', function (data) {
    const newData = data
        .toString()
        .split('\n')
        .filter(x => x !== '');
    if (newData.length) {
        console.error(newData);
        ips = ips.concat(newData);
        main();
    }
});

function readline() {
    if (!ips.length) throw new Error('No more inputs');
    return ips.shift();
}
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

// WRITE YOUR CODE FROM HERE:
// DO NOT NAME YOUR VARIABLES: ips or readline
function main() {
    const ip = readline();
    console.error(ip);
    const firstSpaceInd = ip.indexOf(" ");
    const x = firstSpaceInd % 3, y = Math.floor(firstSpaceInd / 3);
    console.log(x + ' ' + y);
}
