var l_dateCollector = [];
var l_countryKind = [];
var tableCollector;
var tableFull;
var l_image = [];
var l_country = ['US', 'China', 'Japan', 'SKorea', 'Canada'];
var l_countryOriginal = ['United States', 'China', 'Japan', 'Korea, Republic of', 'Canada']
var l_countryName = ['US', 'CHINA', 'JAPAN', 'KOREA', 'CANADA'];
var l_color = ['#424143', '#67666a', '#807f83', '#cbc9cf', '#dddddf'];
var l_colorKind = ['#334c5b', '#4ab29c', '#DAA520', '#dd773f', '#da4049', '#650001',
                   '#766254', '#55345b', '#003b74', '#8cb604', '#dd002c', '#6f0015',
                   '#132c64', '#a67108', '#4c7235', '#7bfcfb', '#7f176b', '#6d9907',
                   '#624054', '#746735', '#4b6d76', '#cc7300', '#9e0028', '#df4c3b',
                   '#609a9c', '#7f4a00', '#4f0823', '#698966', '#c3882f', '#804226']
var l_years = [1900, 1920, 1940, 1960, 1980, 2000];
                   
var l_PNG = ['arbovitae', 'ash', 'beech', 'birch', 'catalpa',
             'cedar', 'crabapple', 'cypress', 'dogwood',
             'elm', 'fir', 'hemlock', 'hawthorn', 'hickory',
             'honeylocust', 'hornbeam', 'juniper', 'larch', 'linden',
             'magnolia', 'maple', 'oak', 'pear', 'pine',
             'spruce', 'willow', 'yellow-poplar', 'yew']
var l_PNGname = ['Arbovitae', 'Ash', 'Beech', 'Birch', 'Catalpa',
             'Cedar', 'Crabapple', 'Cypress', 'Dogwood',
             'Elm', 'Fir', 'Hemlock', 'Hawthorn', 'Hickory',
             'Honeylocust', 'Hornbeam', 'Juniper', 'Larch', 'Linden',
             'Magnolia', 'Maple', 'Oak', 'Pear', 'Pine',
             'Spruce', 'Willow', 'Yellow-poplar', 'Yew']
             
var l_kind = ['hemlock', 'pine', 'oak', 'maple', 'spruce',
              'fir', 'larch', 'birch', 'hawthorn', 'ash',
              'yew', 'beech', 'dogwood', 'linden', 'hickory',
              'redwood', 'cypress', 'cedar', 'elm', 'crabapple',
              'juniper', 'yellow-poplar', 'pear', 'magnolia',
              'hornbeam', 'honeylocust', 'willow', 'catalpa', 'arbovitae']
               
//var TL_BAR = 0;
//var KIND = -1;
var selectedCountry = 0;
var selectedIndex = 0;
var selectedCountryBAR = -1;
var selectedIndexBAR = -1;
var selectedKind = 'blah';
var selectedIndexICON = -1;
var l_xlist = [];
var l_ylist = [];
var l_klist = [];
var l_kindBoundaryL = [];
var l_kindBoundaryR = [];
var l_kindBoundaryT = [];
var l_kindBoundaryB = [];
var l_kindCount = [];
//// below are for icon boundaries
//// and are 1D (instead of 2D like the lists above)
var l_iconBoundaryL = [];
var l_iconBoundaryR = [];
var l_iconBoundaryT = [];
var l_iconBoundaryB = [];




var table, imageTEMP;
var table_dC, table_cK;

/// fonts
var regularFont;
var boldFont;
var lightFont;


function preload() {
  // load tables
  //// one country, one table
  for (var i = 0; i < l_country.length; i++){
    table = loadTable("data/"+l_country[i]+"_dateCollectorKind.csv", "csv", "header");
    l_dateCollector.push(table);
    
    table = loadTable("data/"+l_country[i]+"_kindCount.csv", "csv", "header");
    l_countryKind.push(table);
  }
  //// just a single table
  tableCollector = loadTable("data/collectorCount.csv", "csv", "header");
  tableFull = loadTable("data/full.csv", "csv", "header");
  
  // load images
  for (var i = 0; i < l_PNG.length; i++) {
    imageTEMP = loadImage("data/"+l_PNG[i]+".png");
    l_image.push(imageTEMP);
  }
  
  // load font
  regularFont = loadFont("data/Roboto-Regular.ttf");
  boldFont = loadFont("data/Roboto-Bold.ttf");
  lightFont = loadFont("data/Roboto-Light.ttf");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

}

function draw() {
  textFont(regularFont);
  
  
  // avoid indefinitely adding to the lists
  l_xlist = [];
  l_ylist = [];
  l_klist = [];
  l_kindBoundaryL = [];
  l_kindBoundaryR = [];
  l_kindBoundaryT = [];
  l_kindBoundaryB = [];
  l_kindCount = [];
  l_iconBoundaryL = [];
  l_iconBoundaryR = [];
  l_iconBoundaryT = [];
  l_iconBoundaryB = [];
  
  // prepare plotting
  //// if you are changing the boundaries here,
  //// remember to also change it in mouseMoved() below.
  background(255);
  
  var fL = .275*width;
  var fR = .69*width;
  var fT = .7*height;
  var fB = .97*height;
  //// how many countries to plot the timelines
  var numCountry = 5;
  // for drawing bars
  var bL = .275*width;
  var bR = .9*width;
  var bT = .7*height;
  var bB = .97*height;
  var bTextL = .235*width;
  // for drawing collectors
  //// the y position for the collector circles
  var collectorY = .9*height;
  // for drawing the bars
  //// the thickness of the bars and the opacity when not highlighted
  var barWeight = 25;
  var barUnhoveredAlpha = 90;
  // for drawing icons
  //// icon grid boundaries
  var iL = .01*width;
  var iR = .21*width;
  var iT = .3*height;
  var iB = .9*height; /// probably wouldn't be used
  var iGap = 10;
  var iNum = 4; // number of images per row
  var iNumRows = 7; // number of rows
  var iFactor = .76; // scale image
  // for drawing titles
  var tT = .1*height;
  
  // test bounding box
  //// this is the bounding box
  //noStroke();
  //fill(230);
  //rect(fL-100, fT-30, (fR-fL)+300, (fB-fT)+140);
  //// map bounding box
  var latT = 42.31;
  var latB = 42.29;
  var logL = -71.1337;
  var logR = -71.116;
  var mL = .3*width;
  var mR = .9*width;
  var mT = .025*height;
  var mB = .675*height;
  // bounding box
  noStroke();
  fill(200);
  rect(0, 0, .22*width, height);
  ///
  var mRad = 2;
  var mEnlarge = 1.5;
  var mUnhoveredAlpha = 100;
  /// determine how many kinds will show up on the map
  /// this is for better performance
  var numKindMap = 30; 
  //// draw scatter
  for (var i = 0; i < tableFull.getRowCount(); i++) {
    var log = tableFull.getString(i, 1);
    var lat = tableFull.getString(i, 0);
    var y = map(log, logL, logR, mT, mB);
    var x = map(lat, latT, latB, mL, mR);
    
    noStroke();
    
    var kind = tableFull.getString(i, 2);
    for (var j = 0; j < numKindMap; j++) {
      if (kind == l_kind[j]) {
        var mRed = red(color(l_colorKind[j]));
        var mGreen = green(color(l_colorKind[j]));
        var mBlue = blue(color(l_colorKind[j]));
        
        if (kind == selectedKind) {
          fill(mRed, mGreen, mBlue);
          ellipse(x, y, mRad*mEnlarge, mRad*mEnlarge);
        } else {
          fill(mRed, mGreen, mBlue, mUnhoveredAlpha);
          ellipse(x, y, mRad, mRad);
        }
        
        
        
      } else {
        //fill(50, 255);
        //ellipse(x, y, mRad*mEnlarge, mRad*mEnlarge);
      }
    }
  }
  //////////////////
  
  // draw botton
  //// derprived
  
  noStroke();
  fill(80);
  textAlign(RIGHT,BOTTOM);
  textSize(9);
  //textFont(lightFont);
  text('Data from Arnold Arboretum', width-10, height-20);
  text('Created by Wenxin Cai @ MIT May 2017', width-10, height-10);
  //textFont(regularFont);
  
  // begin real plotting
  //// plot both the timeline and the bar chart at the same time
  
  
  ///// draw timeline /////
  //var baseline = .685*height;
  /// axis and ticks
  //for (var i = 0; i < l_years.length; i++) {
  //  var year = l_years[i];
  //  var x = map(year, 1880, 2015, fL, fR);
  //  
  //  stroke(220);
  //  strokeWeight(.5);
 //   noFill();
 //   line(x, baseline, x, baseline+(fB-fT)+15);
 //   noStroke();
  //  fill(150);
 //   textAlign(CENTER, BOTTOM);
 //   textSize(9);
  //  text(str(year), x, baseline);
  //  textSize(10);
 // }
  
  /// actual timeline
  //for (var i = 0; i < numCountry; i++) {
  //  stroke(color(l_color[i]));
  //  noFill();
  //  strokeWeight(1);
  //  
  //  table = l_dateCollector[i]
  //  var xlist = [];
  //  var ylist = [];
  //  var klist = [];
  //  for (var j = 0; j < table.getRowCount(); j++){
  //    var year = table.getString(j, 0);
  //    var x = map(year, 1880, 2015, fL, fR);
  //    var kind = table.getString(j, 2);
  //    
  //    line(x, fT+(i+.5)*(fB-fT)/numCountry-10, x, fT+(i+.5)*(fB-fT)/numCountry+10);
  //    //ellipse(x, fT+(i+.5)*(fB-fT)/l_dateCollector.length, 8, 8);
  //    
  //    xlist[j] = x;
  //    ylist[j] = year;
  //    klist[j] = kind;
   // }
  //  
  //  l_xlist.push(xlist);
  //  l_ylist.push(ylist);
  //  l_klist.push(klist);
  //}
  /////////////////////////
  ///// draw hover /////
  //var x = l_xlist[selectedCountry][selectedIndex];
  //var y = fT+(selectedCountry+.5)*(fB-fT)/numCountry-10;
  //var year = l_ylist[selectedCountry][selectedIndex];
  //var kind = l_klist[selectedCountry][selectedIndex];
  //stroke(color(l_color[selectedCountry]));
  //noFill();
  //strokeWeight(1);
  //line(x, y, x, y-10);
  //line(x, y-10, x+10, y-10);
  //line(x, y+20, x, y+30);
  //line(x, y+30, x+10, y+30);
  //fill(color(l_color[selectedCountry]));
  //noStroke();
  //textAlign(LEFT, BOTTOM);
  //text(kind, x+12, y-10);
  //textAlign(LEFT, TOP);
  //text('Year '+str(nfc(year, 0)).replace(/\,/g,''), x+12, y+30);
  //////////////////////
  ///// draw collectors /////
  //for (var i = 0; i < tableCollector.getRowCount(); i++) {
  //  var x = map(i, 0, tableCollector.getRowCount()-1, fL, fR);
  //  var r = map(tableCollector.getString(i, 1), 0, 180, 5, 30);
  //  
  //  noStroke();
  //  fill(0);
  //  ellipse(x, collectorY, r, r);
  //  if (i%3 == 0) {
  //    noStroke();
  //    fill(0);
  //    textAlign(CENTER, TOP);
  //    text(tableCollector.getString(i, 2), x, collectorY+18);
  //    
  //    stroke(0);
  //    noFill();
  //    strokeWeight(1);
  //    line(x, collectorY+18, x, collectorY);
  //  } else if (i%3 == 1) {
  //    noStroke();
  //    fill(0);
  //    textAlign(CENTER, TOP);
  //    text(tableCollector.getString(i, 2), x, collectorY+33);
  //    
  //    stroke(0);
  //    noFill();
  //    strokeWeight(1);
  //    line(x, collectorY+33, x, collectorY);
  //  } else if (i%3 == 2) {
  //    noStroke();
  //    fill(0);
  //    textAlign(CENTER, TOP);
  //    text(tableCollector.getString(i, 2), x, collectorY+48);
  //    
  //    stroke(0);
  //    noFill();
  //    strokeWeight(1);
  //    line(x, collectorY+48, x, collectorY);
  //  }
  //}
  ///////////////////////////
  
  
  
  
    
  ///// draw icons /////
  //noStroke();
  //fill(0);
  //rect(0, 0, mL, 50);
  textFont(regularFont);
  noStroke();
  fill(255);
  textSize(24);
  textAlign(LEFT, CENTER);
  text('Museum of Trees', .02*width, 38);
  textFont(regularFont);
  textSize(14);
  textAlign(LEFT, CENTER);
  textLeading(16);
  text("The Arnold Arboretum has a rich collection of trees of the eastern United States and easter Asia.  Many trees originated from collecting expeditions around the world throughout the 20th century.  This visualization guide intends to show the diversity of trees and share the rich history of the arboretum.", .02*width, 20, (iR-iL)-10, .3*height);
  
  
  textSize(10);
  for (var i = 0; i < l_image.length; i++) {
    var iCol = (i%iNum);
    var iRow = (i-iCol)/iNum;
    var iName = l_PNG[i];
    
    
    
    image(l_image[i], iL+iCol*(iB-iT)/iNumRows+(1-iFactor)/2*(iB-iT)/iNumRows, iT+iRow*((iB-iT)/iNumRows+iGap),
          (iB-iT)/iNumRows*iFactor,
          (iB-iT)/iNumRows*iFactor);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    text(l_PNGname[i], iL+iCol*(iB-iT)/iNumRows+.5*(iB-iT)/iNumRows, iT+iRow*((iB-iT)/iNumRows+iGap)+(iB-iT)/iNumRows*(iFactor+(1-iFactor)/3));
    stroke(20);
    noFill();
    strokeWeight(1);
    //rect(iL+iCol*(iR-iL)/iNum - 8, iT+iRow*(iR-iL)/iNum -8, (iR-iL)/iNum, (iR-iL)/iNum);
    
    if (l_kind[selectedIndexBAR] == iName) {
      noStroke();
      var fillColor = color(l_colorKind[selectedIndexBAR]);
      var fillR = red(fillColor);
      var fillG = green(fillColor);
      var fillB = blue(fillColor);
      fill(fillR, fillG, fillB, 110);
      rect(iL+iCol*(iB-iT)/iNumRows, iT+iRow*((iB-iT)/iNumRows+iGap), (iB-iT)/iNumRows, (iB-iT)/iNumRows);
    }
    
    l_iconBoundaryL[i] = iL+iCol*(iB-iT)/iNumRows;
    l_iconBoundaryR[i] = iL+iCol*(iB-iT)/iNumRows + (iB-iT)/iNumRows;
    l_iconBoundaryT[i] = iT+iRow*((iB-iT)/iNumRows+iGap);
    l_iconBoundaryB[i] = iT+iRow*((iB-iT)/iNumRows+iGap) + (iB-iT)/iNumRows;
    
  }
  //////////////////////
    
  ///// draw bar /////
  for (var i = 0; i < l_countryKind.length; i++) {
    stroke(color(l_color[i]));
    noFill();
    strokeWeight(barWeight);
    strokeCap(SQUARE);
    
    table_dC = l_dateCollector[i];
    var barL = map(table_dC.getRowCount(), 0, 1000, 0, (bR-bL));
    //line(fL, fT+(i+.5)*(fB-fT)/8, fL+barL, fT+(i+.5)*(fB-fT)/8);
    
    table_cK = l_countryKind[i];
    var barStart = 0.;
    
    var kindBoundaryL = [];
    var kindBoundaryR = [];
    var kindBoundaryT = [];
    var kindBoundaryB = [];
    var kindCount = [];
    for (var j = 0; j < table_cK.getRowCount(); j++) {
      var count = table_cK.getString(j, 1);
      var barLj = map(count, 0, 1000, 0, (bR-bL));
      
      var strokeColor = color(l_colorKind[j]);
      var strokeR = red(strokeColor);
      var strokeG = green(strokeColor);
      var strokeB = blue(strokeColor);
      stroke(strokeR, strokeG, strokeB, barUnhoveredAlpha);
      strokeWeight(barWeight);
      line(bL+barStart, bT+(i+.5)*(bB-bT)/numCountry, bL+barStart+barLj, bT+(i+.5)*(bB-bT)/numCountry);
      
      kindBoundaryL[j] = bL+barStart;
      kindBoundaryR[j] = bL+barStart+barLj;
      kindBoundaryT[j] = bT+(i+.5)*(bB-bT)/numCountry-.5*barWeight;
      kindBoundaryB[j] = bT+(i+.5)*(bB-bT)/numCountry+.5*barWeight;
      kindCount[j] = count;
      
      barStart += barLj;
      
      
    }
    
    l_kindBoundaryL.push(kindBoundaryL);
    l_kindBoundaryR.push(kindBoundaryR);
    l_kindBoundaryT.push(kindBoundaryT);
    l_kindBoundaryB.push(kindBoundaryB);
    l_kindCount.push(kindCount);
    
    if (barStart < barL) {
      stroke(200, barUnhoveredAlpha);
      strokeWeight(barWeight);
      line(bL+barStart, bT+(i+.5)*(bB-bT)/numCountry, bL+barStart+(barL-barStart), bT+(i+.5)*(bB-bT)/numCountry);
    }
    
    noStroke();
    fill(l_color[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(str(table_dC.getRowCount())+' trees', bL+barL+10, bT+(i+.5)*(bB-bT)/numCountry);
    
    noStroke();
    fill(l_color[2]);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(l_countryName[i], bTextL, bT+(i+.5)*(bB-bT)/numCountry);
    textSize(10);
    
  }
  ////////////////////
  ///// highlight ///// 
  if (selectedIndexBAR != -1) {
    for (var i = 0; i < l_kindBoundaryL.length; i++) {
      noStroke();
      
      stroke(color(l_colorKind[selectedIndexBAR]));
      noFill();
      strokeWeight(barWeight);
      line(l_kindBoundaryL[i][selectedIndexBAR], bT+(i+.5)*(bB-bT)/numCountry,
           l_kindBoundaryR[i][selectedIndexBAR], bT+(i+.5)*(bB-bT)/numCountry);
      noStroke();
      fill(color(l_colorKind[selectedIndexBAR]));
      textAlign(CENTER, BOTTOM);
      text(l_kindCount[i][selectedIndexBAR],
           (l_kindBoundaryL[i][selectedIndexBAR]+l_kindBoundaryR[i][selectedIndexBAR])/2, bT+(i+.5)*(bB-bT)/numCountry-.5*barWeight-1);
    }
  }
  /////////////////////
  
}


function mousePressed() {
  
}





function mouseMoved() {
  var numCountry = 5;
  // plot boundary
  var fL = .25*width;
  var fR = .75*width;
  var fT = .67*height;
  var fB = .95*height;
  // for drawing bars
  var bL = .75*width;
  var bR = .98*width;
  var bT = .05*height;
  var bB = .67*height;
  //// bar boundary
  var barWeight = 35;
  
  
  ///// checking for timeline
  
  
  // set this to be farther than any possible entry in the index    
  var closestDistance = width * 2;
  var distance;
  var xMark;
  
  // loop throught l_xlist to check
  for (var i = 0; i < l_xlist.length; i++) {
    if (mouseY >= fT+(i+.5)*(fB-fT)/l_xlist.length-10 && mouseY < fT+(i+.5)*(fB-fT)/l_xlist.length+10) {
      var xlistTEMP = l_xlist[i];
      
      for (var j = 0; j < xlistTEMP.length; j++) {
        xMark = xlistTEMP[j];
        distance = abs(mouseX - xMark);
        if (distance < closestDistance) {
          closestDistance = distance;
          selectedCountry = i;
          selectedIndex = j;
        }
      }
    }
  }
  
  
  ///// checking for bar charts
  for (var i = 0; i < l_kindBoundaryL.length; i++) {
    
    if (mouseY >= (bT+(i+.5)*(bB-bT)/numCountry-.5*barWeight) && mouseY < (bT+(i+.5)*(bB-bT)/numCountry+.5*barWeight)) {
      var kindBoundaryLTEMP = l_kindBoundaryL[i];
      var kindBoundaryRTEMP = l_kindBoundaryR[i];
      var kindBoundaryTTEMP = l_kindBoundaryT[i];
      var kindBoundaryBTEMP = l_kindBoundaryB[i];
      
      for (var j = 0; j < kindBoundaryLTEMP.length; j++) {
        if (mouseX >= kindBoundaryLTEMP[j] && mouseX < kindBoundaryRTEMP[j] &&
            mouseY >= kindBoundaryTTEMP[j] && mouseY < kindBoundaryBTEMP[j]) {
          /// selectedCountryBAR = i; // no need
          selectedIndexBAR = j;
        }
      }
      
    }
    
  }
  
  
  ///// checking for icons
  for (var i = 0; i < l_iconBoundaryL.length; i++) {
    var iconBoundaryLTEMP = l_iconBoundaryL[i];
    var iconBoundaryRTEMP = l_iconBoundaryR[i];
    var iconBoundaryTTEMP = l_iconBoundaryT[i];
    var iconBoundaryBTEMP = l_iconBoundaryB[i];
    
    if (mouseX >= iconBoundaryLTEMP && mouseX < iconBoundaryRTEMP &&
        mouseY >= iconBoundaryTTEMP && mouseY < iconBoundaryBTEMP) {
      selectedIndexICON = i;
    }
  }
  
  
  /// translate back to selectedIndexBAR and selectedKind
  selectedKindICON = l_PNG[selectedIndexICON];
  for (var i = 0; i < l_kind.length; i++) {
    var selectedKindTEMP = l_kind[i];
    if (selectedKindTEMP == selectedKindICON) {
      selectedIndexBAR = i;
    }
  }
  
  
  selectedKind = l_kind[selectedIndexBAR];
  
  //loop();
}