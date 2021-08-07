import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.scss']
})
export class RuletaComponent implements OnInit {

  options : string[] = [];
  option : string = "";
  startAngle : number = 0;
  arc : number = 0;
  spinTimeout : any = 0;
  spinAngleStart : number = 0;
  spinArcStart : number = 10;
  spinTime : number = 0;
  spinTimeTotal : number = 0;
  message : string = "";
  ctx : any;

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void {
   

    if(this.canvas != undefined && this.canvas != null){
      this.ctx = this.canvas.nativeElement.getContext("2d");
      this.ctx.width = window.innerWidth;
      this.ctx.height = window.innerHeight;
    }

    this.drawRouletteWheel();
    //Swal.fire('Oops...', 'Something went wrong!', 'error')
  }


  byte2Hex(n : number) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }
  
  RGB2Color(r : number, g : number, b : number) {
    return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
  }
  
  getColor(item : any, maxitem : any) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI*2/maxitem;
    
    var red   = Math.sin(frequency * item + 2 + phase) * width + center;
    var green = Math.sin(frequency * item + 0 + phase) * width + center;
    var blue  = Math.sin(frequency * item + 4 + phase) * width + center;
    
    return this.RGB2Color(red,green,blue);
  }
  
  drawRouletteWheel() {
      this.arc = Math.PI / (this.options.length / 2);
      var outsideRadius = 200;
      var textRadius = 160;
      var insideRadius = 0;
      this.ctx.clearRect(0,0,500,500);
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = .01;
  
      this.ctx.font = 'bold 15px Helvetica, Arial';
  
      for(var i = 0; i < this.options.length; i++) {
        var angle = this.startAngle + i * this.arc;
        // ctx.fillStyle = colors[i];
        this.ctx.fillStyle = this.getColor(i, this.options.length);
  
        this.ctx.beginPath();
        this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
        this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
        
        this.ctx.stroke();
        this.ctx.fill();
  
        this.ctx.save();
        //this.ctx.shadowOffsetX = -1;
        //this.ctx.shadowOffsetY = -1;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "rgb(220,220,220)";
        this.ctx.fillStyle = "black";
        this.ctx.translate(250 + Math.cos(angle + this.arc / 2) * textRadius, 
                      250 + Math.sin(angle + this.arc / 2) * textRadius);
                      this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
        var text = this.options[i];
        this.ctx.fillText(text, - this.ctx.measureText(text).width / 2, 50);
        this.ctx.restore();
      } 
  
      if(this.options.length == 0){
        this.ctx.font = "20px Georgia";
      
        this.ctx.font = "30px Verdana";
        // Create gradient
        var gradient = this.ctx.createLinearGradient(0, 0, this.ctx.width, 0);
        gradient.addColorStop("0", "#E23F3F");
        //gradient.addColorStop("0.5", "blue");
        //gradient.addColorStop("1.0", "red");
        // Fill with gradient
        this.ctx.fillStyle = gradient;
        this.ctx.fillText("Empty roulette!", 130, 250);
        
      }

      //Arrow
      this.ctx.fillStyle = "#E23F3F";
      this.ctx.strokeStyle = "#932B2B";
      this.ctx.beginPath();
      //this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.moveTo(250 - 10, 250 - (outsideRadius + 30)); // punto inicial
      this.ctx.lineTo(250 + 10, 250 - (outsideRadius + 30)); // horizontal -> 
      this.ctx.lineTo(250 + 10, 250 - (outsideRadius - 15)); // vertical hacia abajo
      this.ctx.lineTo(250 + 25, 250 - (outsideRadius - 15)); // linea horizontal ->
      this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 45)); // vertical inclinada hacia abajo
      this.ctx.lineTo(250 - 25, 250 - (outsideRadius - 15)); // vertical inclinada hacia arriba
      this.ctx.lineTo(250 - 10, 250 - (outsideRadius - 15)); // linea horizontal ->
      this.ctx.lineTo(250 - 10, 250 - (outsideRadius + 30));


      this.ctx.lineWidth = 1.5;
      this.ctx.fill();
      this.ctx.stroke()

      this.ctx.fillStyle = "black";
      /*this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.fill();*/

    
    
  }
  
  spin() {
    if(this.options.length > 1){
      this.spinAngleStart = Math.random() * 10 + 10;
      this.spinTime = 0;
      this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
      this.rotateWheel();
    }
    else
      Swal.fire('Error', `The roulette wheel must have at least two elements`, 'error');
  }
  
  rotateWheel() {
    this.spinTime += 5;
    if(this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    var spinAngle = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
    this.startAngle += (spinAngle * Math.PI / 180);
    this.drawRouletteWheel();
    this.spinTimeout = setTimeout(() => this.rotateWheel(), 5);
  }
  
  stopRotateWheel() {
    clearTimeout(this.spinTimeout);
    var degrees = this.startAngle * 180 / Math.PI + 90;
    var arcd = this.arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    this.ctx.save();
    this.ctx.font = 'bold 30px Helvetica, Arial';
    var text = this.options[index]
    this.ctx.fillText(text, 250 - this.ctx.measureText(text).width / 2, 250 + 10);
    this.ctx.restore();
  }
  
  easeOut(t : number, b : number, c : number, d : number) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }
  
  

  add(){
    if(this.option.trim() != ""){

      let notIncluded = !this.options.includes(this.option.trim());

      if(notIncluded){
        this.options.push(this.option);
        this.option = "";
        this.drawRouletteWheel();
      }
      else
      Swal.fire('Error', `The field already exists`, 'error');
    } 
    else 
      Swal.fire('Error', `The field mustn't be empty`, 'error');
    
  }

  remove(index : number){
    this.options.splice(index, 1);
    this.drawRouletteWheel();
  }

  clear(){
    this.options = [];
    this.drawRouletteWheel();
  }

}
