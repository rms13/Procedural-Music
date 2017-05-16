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
        //create a synth and connect it to the master output (your speakers)
        var synth = new Tone.Synth().toMaster();
        //play a middle 'C' for the duration of an 8th note
        var notes = ['C4','D4','E4','F4','G4','A4','B4'];

        for(var i=0;i<7;i++)
            synth.triggerAttackRelease(notes[i], '8n');
    }
}
