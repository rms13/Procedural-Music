const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const Tone = require('tone');
//import Framework from './framework'

export default class MusicMaker
{
    constructor() {
        this.on = false;
        this.compositionLength = 16;
        this.compositionLength *= 16;
        this.notes = ['C',          // SA
                    'Db','D',     // RE
                    'Eb','E',     // GA
                    'F','F#',     // MA
                    'G',           // PA
                    'Ab','A',     // DHA
                    'Bb','B'];    // NI
        this.createPiano();
        this.bhairavMarkov();
        this.bhairavCompose2();
    }

    createPiano()
    {
        this.multiPlayer = new Tone.MultiPlayer().toMaster();
        var list = ["C","D","E","F","G","A","B","Db","Eb","Gb","Ab","Bb"];
        for(var i=0; i<12; i++)
        {
            this.multiPlayer.add(list[i]+"3","./instruments/piano/Piano.mf."+list[i]+"3.wav");
            this.multiPlayer.add(list[i]+"4","./instruments/piano/Piano.mf."+list[i]+"4.wav");
            this.multiPlayer.add(list[i]+"5","./instruments/piano/Piano.mf."+list[i]+"5.wav");
        }
        //console.log(this.multiPlayer);

        // new Tone.Loop(time => {
        //     //this.multiPlayer.start("C3","1m",0,'+4n'); //.start (bufferName, time[, offset][, duration][, pitch][, gain])
        //     for(var i=0; i<7; i++)
        //     {
        //         this.multiPlayer.start(list[i]+"3",'+'+i+'m/4',0,'1m');
        //     }
        // }, 6+'m').start();
        // Tone.Transport.bpm.value = 120;
    }

    test()
    {
        this.simplePolySynth();
    }

    convertNote(input)
    {
        if(input == 'S') return 'C';
        else if(input == 'r') return 'Db';
        else if(input == 'R') return 'D';
        else if(input == 'g') return 'Eb';
        else if(input == 'G') return 'E';
        else if(input == 'M') return 'F';
        else if(input == 'm') return 'Gb';
        else if(input == 'P') return 'G';
        else if(input == 'd') return 'Ab';
        else if(input == 'D') return 'A';
        else if(input == 'n') return 'Bb';
        else return 'B'; // N
    }

    simplePolySynth()
    {
        new Tone.Loop(time => {
            // COMPOSITION:
            //      DECIDE NEXT NOTE HERE

            var matraOffset = 0;
            this.currentNote = 0;
            //this.currentOctave = 4;

            for(var i=0; i<this.composedString.length; i++)
            {
                var nextnote = this.convertNote(this.composedString[this.currentNote][0]);
                this.multiPlayer.start(nextnote+this.composedString[this.currentNote][1], '+1m*'+matraOffset/8,0,'1m');
                matraOffset+=this.composedStringLength[this.currentNote];
                this.currentNote++;
            }
        }, this.compositionLength+'m/8+16m/8').start();
        //Tone.Transport.bpm.value = 120 * 8;
    }

    simpleDuoSynth()
    {
        var envelope = {
              attack: 0.1,
              release: 1,
              releaseCurve: 'linear'
          };
        var filterEnvelope = {
              baseFrequency: 200,
              octaves: 2,
              attack: 0,
              decay: 0,
              release: 1000
          };

        var synth = new Tone.DuoSynth({
            harmonicity: 1,
            voice0: {
                oscillator: {type: 'sawtooth'},
                envelope,
                filterEnvelope
            },
            voice1: {
                oscillator: {type: 'sine'},
                envelope,
                filterEnvelope
            },
           vibratoRate: 1.5,
           vibratoAmount: 0.1
        });
        synth.toMaster();
        //synth.triggerAttackRelease('C4', 1);

        this.currentOctave='4'; // CURRENT OCTAVE
        // var notes = ['C',          // SA
        //             'Db','D',     // RE
        //             'Eb','E',     // GA
        //             'F','F#',     // MA
        //             'G',           // PA
        //             'Ab','A',     // DHA
        //             'Bb','B'];    // NI

        new Tone.Loop(time => {
            // COMPOSITION:
            //      DECIDE NEXT NOTE HERE

            var matraOffset = 0;
            this.currentNote = 0;
            //this.currentOctave = 4;

            for(var i=0; i<this.composedString.length; i++)
            {
                var nextnote = this.convertNote(this.composedString[this.currentNote][0]);
                synth.triggerAttackRelease(nextnote+this.composedString[this.currentNote][1], '+'+matraOffset+'m');
                matraOffset+=this.composedStringLength[this.currentNote];
                this.currentNote++;
            }
        }, this.compositionLength+'m+16m').start();

        Tone.Transport.bpm.value = 120 * 8;
    }

    bhairavCompose()
    {
        // var notes = ['C',          // SA
        //             'Db','D',     // RE
        //             'Eb','E',     // GA
        //             'F','F#',     // MA
        //             'G',           // PA
        //             'Ab','A',     // DHA
        //             'Bb','B'];    // NI

        /// Aroha (Ascent)- SrGM,Pd,N
        /// Avaroha (Descent)- Nd,PMG,r,S
        /// Pakada (Distinctive tonal phrases)-	S, G, MP, d,P

        var aroha = [this.notes[0],     // S
                     this.notes[1],     // r
                     this.notes[4],     // G
                     this.notes[5],     // M
                     this.notes[7],     // P
                     this.notes[8],     // d
                     this.notes[11]];   // N

        var avaroha = [this.notes[11],
                       this.notes[8],
                       this.notes[7],
                       this.notes[5],
                       this.notes[4],
                       this.notes[1],
                       this.notes[0]];

        var pakad = [this.notes[0], 2,
                     this.notes[4], 2,
                     this.notes[5], 1,
                     this.notes[7], 2,
                     this.notes[8], 2,
                     this.notes[7], 1];

        this.composedString = [];
        this.composedStringLength = [];
        this.totalMatra = 10;//7+7+6;

        for(var i=0; i<6; i++)
        {
            this.composedString[i]=pakad[i*2];
            this.composedStringLength[i]=pakad[i*2+1];
        }
    }

    bhairavCompose2()
    {
        // var aroha = [this.notes[0],     // S
        //              this.notes[1],     // r
        //              this.notes[4],     // G
        //              this.notes[5],     // M
        //              this.notes[7],     // P
        //              this.notes[8],     // d
        //              this.notes[11]];   // N
        //
        // var avaroha = [this.notes[11],
        //                this.notes[8],
        //                this.notes[7],
        //                this.notes[5],
        //                this.notes[4],
        //                this.notes[1],
        //                this.notes[0]];

        this.composedString = [];
        this.composedStringLength = [];
        this.totalMatra = this.compositionLength;//128*2;
        this.startString = 'G4M4d4';

        var n1,n2,n3,n;
        n1 = 'G4'; n2 = '__'; n3 = 'M4';

        this.composedString.push(n1);
        //this.composedString.push(n2);
        this.composedString.push(n3);

        this.composedStringLength.push(2);
        //this.composedStringLength.push(2);
        this.composedStringLength.push(2);

        for(var j=0; j<this.totalMatra;j++)
        {
            //console.log(j);
            var index = (this.noteList.indexOf(n1))*22*22
                        +(this.noteList.indexOf(n2))*22
                        +(this.noteList.indexOf(n3));

            if(this.noteMatrix3[index][21]==-1.0)
            {
                var prob = Math.random();
                if(prob<0.25 && this.noteList.indexOf(n3)!=21) // aroha
                {
                    n = this.noteList[this.noteList.indexOf(n3)+1];
                }
                else if(prob<0.5 && this.noteList.indexOf(n3)!=0) // avaroha
                {
                    n = this.noteList[this.noteList.indexOf(n3)-1];
                }
                else if(prob<0.75 || this.composedStringLength[this.composedStringLength.length-1]>=2) // repeat
                {
                    n = n3;
                }
                else // space
                {
                    n = this.noteList[21];
                }

                if(n!='__')
                {
                    this.composedString.push(n);
                    this.composedStringLength.push(len);
                }
                else
                {
                    this.composedStringLength[this.composedStringLength.length-1]++;
                }

            }
            else
            {
                var prob = Math.random();
                var i;
                for(i=0; i<22; i++)
                {
                    //console.log('j '+j+' i '+i);
                    //debugger;
                    if(this.noteMatrix3[index][i]>prob)
                        break;
                }
                var len=1;
                n=this.noteList[i];

                if(n!='__')
                {
                    this.composedString.push(n);
                    this.composedStringLength.push(len);
                }
                else
                {
                    this.composedStringLength[this.composedStringLength.length-1]++;
                }
            }

            n1=n2;
            n2=n3;
            n3=n;

        }

        console.log(this.composedString);
        console.log(this.composedStringLength);
    }

    bhairavMarkov()
    {
        // S r G M P d N _
        // 0 1 2 3 4 5 6 7
        var nl = ['S','r','G','M','P','d','N'];
        this.noteList = [];
        for(var i=0; i<7; i++)
        {
            this.noteList[i]=nl[i]+3;
            this.noteList[i+7]=nl[i]+4;
            this.noteList[i+14]=nl[i]+5;
        }
        this.noteList[21]='__'; //blank space as an extra note - represented by 2 underscores

        /// MATRIX CREATION
        this.noteMatrix3 = [];
        var index = 0;
        for(var i=0; i<22; i++)
        {
            for(var j=0; j<22; j++)
            {
                for(var k=0; k<22; k++)
                {
                    this.noteMatrix3[index] = [];
                    //noteMatrix3[index][0] = noteList[i]+noteList[j]+noteList[k];    // name : S4r4G4
                    for(var l=0; l<22; l++)
                        this.noteMatrix3[index][l] = 0.0;                                    // probabilities

                    index++;
                }
            }
        }

        /// MATRIX COMPUTING
        // var trainString = 'S4r4G4M4P4__d4N4';

        // // SHORT PHRASES FROM "VISTAAR"
        // var trainString = 'S4 __ d3 N3 S4 S4 __ __ r4 S4 S4 r4 G4 __ r4 G4 M4 G4 __ r4 __ S4 r4 N3 d3 N3 r4 __ S4'
        //                 + 'S4 r4 G4 M4 G4 M4 G4 r4 G4 r4 G4 M4 P4 M4 P4 d4 P4 M4 G4 r4 G4 M4 d4 __ P4 M4 G4 M4 r4 __ S4'
        //                 + 'G4 M4 d4 __ P4 d4 M4 P4 G4 M4 r4 __ S4 r4 G4 M4 d4 P4 d4 N4 d4 S5 N4 d4 P4 d4 M4 N4 d4 P4 M4 P4 G4 M4 r4 S4'
        //                 + 'S4 r4 G4 M4 P4 d4 __ N4 d4 P4 d4 N4 S5 __ __ N4 S5 r5 S5 N4 d4 P4 P4 d4 N4 S5 r5 G5 r5 S5 N4 d4 P4 __ M4 P4 G4 r4 M4 G4 r4 S4';
        //
        // // SARGAM - EKTAAL
        // trainString +=  'S4 r4 G4 M4 d4 __ P4 __ G4 M4 r4 S4'
        //                +'r4 __ S4 __ d3 S4 r4 S4 G4 M4 d4 __'
        //                +'M4 P4 G4 M4 d4 N4 S5 __ S5 S5 r5 S5'
        //                +'S5 N4 d4 P4 G4 M5 d4 N4 S5 __ r5 S5'
        //                +'S5 r5 __ N4 S5 __ d4 N4 __ G4 M4 d4';

        // SHORT PHRASES FROM "VISTAAR"
        var trainString = 'S4 __ __ __ d3 __ N3 __ S4 __ S4 __ __ __ __ __ r4 __ S4 __ S4 __ r4 __ G4 __ __ __ r4 __ G4 __ M4 __ G4 __ __ __ r4 __ __ __ S4 __ r4 __ N3 __ d3 __ N3 __ r4 __ __ __ S4 __'
        + 'S4 __ r4 __ G4 __ M4 __ G4 __ M4 __ G4 __ r4 __ G4 __ r4 __ G4 __ M4 __ P4 __ M4 __ P4 __ d4 __ P4 __ M4 __ G4 __ r4 __ G4 __ M4 __ d4 __ __ __ P4 __ M4 __ G4 __ M4 __ r4 __ __ __ S4 __'
        +'G4 __ M4 __ d4 __ __ __ P4 __ d4 __ M4 __ P4 __ G4 __ M4 __ r4 __ __ __ S4 __ r4 __ G4 __ M4 __ d4 __ P4 __ d4 __ N4 __ d4 __ S5 __ N4 __ d4 __ P4 __ d4 __ M4 __ N4 __ d4 __ P4 __ M4 __ P4 __ G4 __ M4 __ r4 __ S4 __'
        +'S4 r4 G4 M4 P4 d4 __ __ __ N4 __ d4 __ P4 __ d4 __ N4 __ S5 __ __ __ __ __ N4 __ S5 __ r5 __ S5 __ N4 __ d4 __ P4 __ P4 __ d4 __ N4 __ S5 __ r5 __ G5 __ r5 __ S5 __ N4 __ d4 __ P4 __ __ __ M4 __ P4 __ G4 __ r4 __ M4 __ G4 __ r4 __ S4 __';

        // SARGAM - EKTAAL
        trainString +=  'S4 __ r4 __ G4 __ M4 __ d4 __ __ __ P4 __ __ __ G4 __ M4 __ r4 __ S4 __'
        +'r4 __ __ __ S4 __ __ __ d3 __ S4 __ r4 __ S4 __ G4 __ M4 __ d4 __ __ __'
        +'M4 __ P4 __ G4 __ M4 __ d4 __ N4 __ S5 __ __ __ S5 __ S5 __ r5 __ S5 __'
        +'S5 __ N4 __ d4 __ P4 __ G4 __ M5 __ d4 __ N4 __ S5 __ __ __ r5 __ S5 __'
        +'S5 __ r5 __ __ __ N4 __ S5 __ __ __ d4 __ N4 __ __ __ G4 M4 __ d4 __ __ __';

        // TAAN [STHAYI]
        trainString += 'S4 r4 G4 M4 P4 M4 G4 M4 P4 d4 M4 P4 G4 M4 r4 S4'
        + 'd4 P4 M4 P4 G4 M4 G4 r4 G4 M4 P4 M4 G4 r4 S4 __'
        + 'S4 r4 G4 M4 P4 M4 G4 M4 P4 d4 N4 d4 P4 d4 N4 S5 r5 S5 __ r5 N4 S5 N4 d4'
        + 'S4 r4 S4 r4 r4 G4 r4 G4 G4 M4 G4 M4 M4 P4 M4 P4 P4 d4 P4 d4 d4 N4 d4 N4 N4 S5 N4 S5 r5 __ S5 __'
        + 'S4 r4 G4 r4 r4 G4 M4 G4 G4 M4 P4 M4 M4 P4 d4 P4 P4 d4 N4 d4 d4 N4 S5 __ S5 N4 d4 P4 M4 G4 r4 S4';

        // TAAN [ANTRA]
        trainString += 'd4 N4 S5 r5 S5 N4 d4 P4 M4 P4 G4 M4 P4 d4 N4 S5'
        + 'S4 r4 G4 M4 P4 __ G4 M4 P4 d4 N4 S4 r4 __ S4 __'
        + 'S5 N4 d4 P4 M4 G4 r4 S4 S4 r4 G4 M4 P4 d4 N4 S5'
        + 'N4 S5 N4 d4 N4 d4 P4 d4 P4 M4 P4 M4 G4 M4 G4 M4 P4 M4 P4 d4 P4 d4 N4 d4 N4 S5 N4 S5 r5 __ S5 __'
        + 'S5 r5 r5 N4 S5 S5 d4 N4 N4 P4 d4 d4 M4 P4 P4 G4 M4 M4 r4 G4 G4 S4 r4 r4 N4 S4 S4 r4 G4 M4 P4 __';

        trainString = trainString.replace(/ /g,''); // remove white spaces

        //USE THIS TO FORMAT THE STRING AND EDIT THE OUTPUT FOR FAST INTERMEDIATE NOTES..
        //trainString = trainString.replace(/ /g,' __ '); // replace white spaces with __ and play at double speed..

        //console.log(trainString);

        var trainStringLength = trainString.length/2;
        for(var i=0; i<trainStringLength-3; i++)
        {
            var n1 = trainString[i*2]+trainString[i*2+1];
            var n2 = trainString[i*2+2]+trainString[i*2+3];
            var n3 = trainString[i*2+4]+trainString[i*2+5];
            var n = trainString[i * 2 + 6] + trainString[i * 2 + 7];

            var index = (this.noteList.indexOf(n1))*22*22
						+(this.noteList.indexOf(n2))*22
						+(this.noteList.indexOf(n3));
            //alert(noteMatrix3[index][0]);

            this.noteMatrix3[index][this.noteList.indexOf(n)]++;
        }

        for(var i=0; i<22*22*22; i++)
        {
            //var tot=0;
            for(var j=1; j<22; j++)
                this.noteMatrix3[i][j]+=this.noteMatrix3[i][j-1];
            if(this.noteMatrix3[i][21]==0)
                this.noteMatrix3[i][21] = -1.0; // if nothing, mark it with probability -1..
            else
            {
                for(var j=0; j<22; j++)
                    this.noteMatrix3[i][j]/=this.noteMatrix3[i][21]; // convert to cumulative frequency..
            }
        }

    }

}
