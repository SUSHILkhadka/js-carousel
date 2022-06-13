
let imgwidth = 200;

var nobuttonpress = true;//flag for not letting autotransition work immediately after button click
var restTimeAfterClick = 4000;
var framerate = 60;
let widthofOneCircle = 4;//width of navigator circle

//for not letting autotransition work immediately after manual transition
function noAutotransitionAfterEvent() {

    nobuttonpress = false;
    console.log(nobuttonpress);
    setTimeout(function () {
        nobuttonpress = true;
    }, restTimeAfterClick);

}



class carousel {
    constructor(parent, imagecontainer, transitiontime, autoTransitionTime) {
        // this.imgarray = imgurl;
        this.transitiontime = transitiontime;
        this.carouselbox = document.querySelector(parent);
        this.carouselimages = document.querySelector(imagecontainer);

        this.img = document.querySelectorAll(imagecontainer + ' img');

        //these are carousel information
        this.imglength = this.img.length;
        this.autoTransitionTime = autoTransitionTime
        this.imgIndex = 1;
        this.tx = +0;
        this.prevIndex = 0;
        this.txprev = -200;

    }

    carouselSetup() {
        this.carouselbox.style.display = 'flex';
        this.carouselbox.style.width = `${imgwidth}px`;
        this.carouselbox.style.height = `${imgwidth}px`;
        this.carouselbox.style.position = 'relative';
        this.carouselbox.style.alignItems = 'center';
        this.carouselbox.style.overflow = 'hidden';

    }
    imagesSetup() {

        this.carouselimages.style.display = 'flex';
        this.carouselimages.style.transform = `translateX(0)`;

    }
    createButton() {
        this.prevbtn = document.createElement('button');
        this.nextbtn = document.createElement('button');
        this.prevbtn.append("<")
        this.nextbtn.append(">")

        this.prevbtn.style.position = 'absolute'
        this.prevbtn.style.opacity = '50%';
        this.nextbtn.style.position = 'absolute'
        this.nextbtn.style.opacity = '50%';
        this.nextbtn.style.zIndex = '1';
        this.prevbtn.style.zIndex = '1';

        this.nextbtn.style.right = '0px';

        this.carouselbox.append(this.prevbtn);
        this.carouselbox.append(this.nextbtn);
        this.prevbtn.addEventListener('click', event => {


            //for not letting autotransition work immediately after buttonpress
            noAutotransitionAfterEvent();

            //if prev btn press, then decrease current image index  by 1,i.e 'imgIndex--',
            this.prevIndex = this.imgIndex;

            //if 'imgIndex' is at left limit, simply go to length of image.
            if (this.imgIndex == 1) {
                this.imgIndex = this.imglength;

            }
            else {
                this.imgIndex--;
            }
            this.customTransition();

        });

        this.nextbtn.addEventListener('click', event => {
            //same as before
            noAutotransitionAfterEvent();

            this.prevIndex = this.imgIndex;
            if (this.imgIndex == this.imglength) {
                this.imgIndex = 1;
            }
            else {
                this.imgIndex++;
            }
            this.customTransition();
        });


    }

    createNavigator() {

        // 'l' is the first left offset position for circle navigators.
        let l = (100 - (2 * this.imglength - 1) * widthofOneCircle) / 2;


        //create 'imglength' circle navigators, starting with left=l,l+2,l+4,.... leaving 1 circle in between 2 circles.
        for (let i = 0; i < this.imglength; i++) {
            var lposition = l + 2 * i * widthofOneCircle;

            let circle = document.createElement('div');
            circle.style.width = `${widthofOneCircle}%`;
            circle.style.height = `${widthofOneCircle}%`;
            circle.style.position = 'absolute';
            circle.style.background = 'white';
            circle.style.borderRadius = '50%'
            circle.style.bottom = '20px';
            circle.style.left = `${lposition}%`
            this.carouselbox.append(circle);

            //listening to circle navigator. Whatever indicator is clicked, transition as per current image index i.e 'this.imgIndex' and circle navigator index i.e 'i'
            circle.addEventListener('click', event => {
                noAutotransitionAfterEvent();
                this.prevIndex = this.imgIndex;
                this.imgIndex = i + 1;

                this.customTransition();
            })

        }
    }

    //this is transition function for images in carousel
    customTransition() {

        let diffIndex = this.prevIndex - this.imgIndex;

        this.txprev = this.tx;  //for storing previous x start point

        this.tx += (diffIndex * imgwidth);//now this is destination x point
        //if difference is more than 2,here we will only show as if differene is only 1, to make smoother transition. This can be commented to get full transition
        this.txprev = this.txprev < this.tx ? this.tx - imgwidth : this.tx + imgwidth;
        let addreq = Math.abs((this.txprev - this.tx) / (60 * this.transitiontime));//we will add this variable with txprev, upto to tx



        //this is to remove oscillation
        if (addreq == 0) {
            this.txprev = this.tx;
        }

        //this "greater" variable is to remove oscillation. Since we are adding 'addreq' to 'txprev', we could pass 'tx'. This is to check that.
        let greater = false;
        if (this.tx > this.txprev) {
            greater = true;
        }
        let trans = setInterval(function () {
            //greater==true represents that we are meant to increase to tx.
            if (greater == true) {

                //if 'txprev' was smaller than 'tx', and by adding 'addreq' to 'txprev' we are greater 'tx', we need to stop now.
                if (this.txprev > this.tx) {
                    this.txprev = this.tx;
                    clearInterval(trans);
                }
                else {
                    this.txprev += addreq;
                }
            }
            //same as above
            //greater==false represents that we are meant to decrease to tx.
            if (greater == false) {
                //here 'txprev' was meant to decrease down to 'tx'. If 'txprev' is below 'tx', immediately stop.
                if (this.txprev < this.tx) {
                    this.txprev = this.tx;
                    clearInterval(trans);
                }
                else {
                    this.txprev -= addreq;
                }
            }
            console.log(this.txprev, this.tx, addreq)

            //this is actual small translation step.
            this.carouselimages.style.transform = `translateX(${this.txprev}px)`;
        }.bind(this), 1000 / 300);
    }

    autoTransition() {
        var repeatInterval = setInterval(function () {

            //first 'nobuttonpress' flag checking, then only autotransition process
            //simple  increase by 1 auto transition
            if (nobuttonpress == true) {
                this.prevIndex = this.imgIndex;
                console.log(this.prevIndex);
                this.imgIndex++;
                if (this.imgIndex == this.imglength + 1) this.imgIndex = 1;
                this.customTransition(this.prevIndex, this.imgIndex);
            }
        }.bind(this), this.autoTransitionTime);
    }

}



//
let c = new carousel(".carousel", ".carousel__images", 1, 500);
c.carouselSetup();
c.imagesSetup();
c.createButton();
c.createNavigator();
c.autoTransition();


let c2 = new carousel(".carousel2", ".carousel__images2", 2, 4000);
c2.carouselSetup();
c2.imagesSetup();
c2.createButton();
c2.createNavigator();
c2.autoTransition();

let c3 = new carousel(".carousel3", ".carousel__images3", 3, 1000);
c3.carouselSetup();
c3.imagesSetup();
c3.createButton();
c3.createNavigator();
c3.autoTransition();

let c4 = new carousel(".carousel4", ".carousel__images4", 4, 3000);
c4.carouselSetup();
c4.imagesSetup();
c4.createButton();
c4.createNavigator();
c4.autoTransition();





