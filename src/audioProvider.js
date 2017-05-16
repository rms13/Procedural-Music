const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const Tone = require('tone');
//import Framework from './framework'

export default class MusicMaker
{
    constructor() {
        this.on = false;
    }

    test()
    {
        //console.log("hi");
        this.simpleDuoSynth();
    }
    simpleNotes()
    {
        //create a synth and connect it to the master output (your speakers)
        var synth = new Tone.Synth().toMaster();
        //play a middle 'C' for the duration of an 8th note
        var notes = ['C4','D4','E4','F4','G4','A4','B4'];

        for(var i=0;i<7;i++)
            synth.triggerAttackRelease(notes[i], '8n');
    }
    simpleMonoSynth()
    {
        var synth = new Tone.MonoSynth({
          oscillator: {type: 'sawtooth'},
          envelope: {
            attack: 0.1,
            release: 4,
            releaseCurve: 'linear'
          },
          filterEnvelope: {
            baseFrequency: 200,
            octaves: 2,
            attack: 0,
            decay: 0,
            release: 1000
          }
        });
        synth.toMaster();
        synth.triggerAttackRelease('C4', 1);
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
        var notes = ['C4','D4','E4','F4','G4','A4','B4'];
        var i=0;
        new Tone.Loop(time => {
          synth.triggerAttackRelease(notes[i], '8n', '+4n');//1, time);
          if(i<6)
            i++;
          else
            i=0;
        }, '1m').start();
        Tone.Transport.bpm.value = 240;
        Tone.Transport.start();
    }
}
