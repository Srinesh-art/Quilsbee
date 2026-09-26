import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function QuantumHeroScene(){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(32,1,.1,100);
    camera.position.set(0,0.2,12.5);
    camera.lookAt(0,.1,0);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.18;
    renderer.setClearColor(0,0);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdcecff,0x07131d,2.2));
    const key=new THREE.DirectionalLight(0xfff1dc,5);key.position.set(4,7,7);scene.add(key);
    const fill=new THREE.DirectionalLight(0x5e8dff,3.2);fill.position.set(-5,2,4);scene.add(fill);
    const rim=new THREE.PointLight(0x55dfff,7,15);rim.position.set(0,1.1,2.8);scene.add(rim);
    const warm=new THREE.PointLight(0xff9d42,3.8,13);warm.position.set(-2,-1,2);scene.add(warm);

    // Superconducting quantum-processor architecture inspired by the supplied reference.
    // The entire assembly is deliberately offset right so it sits beside the hero copy.
    const root=new THREE.Group();root.position.set(.45,.05,.15);root.scale.setScalar(.52);scene.add(root);
    const machine=new THREE.Group();root.add(machine);
    machine.rotation.x=-.16;

    const black=new THREE.MeshPhysicalMaterial({color:0x0b1118,metalness:.9,roughness:.2});
    const darkCopper=new THREE.MeshPhysicalMaterial({color:0x6b3519,metalness:.92,roughness:.18});
    const copper=new THREE.MeshPhysicalMaterial({color:0xd88735,metalness:.96,roughness:.14});
    const gold=new THREE.MeshPhysicalMaterial({color:0xf0b95b,metalness:.95,roughness:.13});
    const silver=new THREE.MeshPhysicalMaterial({color:0xd9e1e7,metalness:.94,roughness:.14});
    const ceramic=new THREE.MeshPhysicalMaterial({color:0xf1eadf,metalness:.08,roughness:.28});
    const blueMetal=new THREE.MeshPhysicalMaterial({color:0x193c67,metalness:.75,roughness:.2});
    const cyan=new THREE.MeshStandardMaterial({color:0x45dfff,emissive:0x24bde7,emissiveIntensity:3.2,metalness:.1,roughness:.18});

    const layers=[];
    const makeLayer=(y)=>{const g=new THREE.Group();g.position.y=y;machine.add(g);layers.push(g);return g;};
    const base=makeLayer(-1.45), lower=makeLayer(-.75), core=makeLayer(0), upper=makeLayer(.72), lid=makeLayer(1.35);

    const cyl=(r,h,mat,rad=96)=>new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,rad),mat);
    const tor=(r,t,mat)=>new THREE.Mesh(new THREE.TorusGeometry(r,t,20,128),mat);

    base.add(cyl(3.15,.24,black));
    const baseRing=tor(3.03,.17,copper);baseRing.rotation.x=Math.PI/2;baseRing.position.y=.16;base.add(baseRing);
    const baseInner=tor(2.72,.07,gold);baseInner.rotation.x=Math.PI/2;baseInner.position.y=.18;base.add(baseInner);
    lower.add(cyl(2.55,.16,blueMetal));
    const lowerRing=tor(2.42,.11,copper);lowerRing.rotation.x=Math.PI/2;lowerRing.position.y=.13;lower.add(lowerRing);
    core.add(cyl(2.08,.1,black));
    const coreRing=tor(2.0,.08,gold);coreRing.rotation.x=Math.PI/2;coreRing.position.y=.1;core.add(coreRing);
    upper.add(cyl(2.72,.12,black));
    const upperRing=tor(2.62,.13,copper);upperRing.rotation.x=Math.PI/2;upperRing.position.y=.12;upper.add(upperRing);
    lid.add(cyl(3.15,.22,black));
    const lidRing=tor(3.02,.18,gold);lidRing.rotation.x=Math.PI/2;lidRing.position.y=-.1;lid.add(lidRing);
    const lidInner=tor(2.48,.08,silver);lidInner.rotation.x=Math.PI/2;lidInner.position.y=-.22;lid.add(lidInner);
    // Repeating gold traces and contact pads on the lower quantum board.
    const padGeo=new THREE.CylinderGeometry(.055,.055,.13,16);
    const padPositions=[];
    for(let ring=0;ring<3;ring++){
      const radius=1.25+ring*.42;
      for(let i=0;i<24;i++){
        const a=i/24*Math.PI*2;
        const p=new THREE.Mesh(padGeo,copper);
        p.position.set(Math.cos(a)*radius,.18,Math.sin(a)*radius);
        lower.add(p);padPositions.push(p);
      }
    }
    const traceMat=new THREE.MeshBasicMaterial({color:0xe6a54a,transparent:true,opacity:.82});
    for(let i=0;i<20;i++){
      const a=i/20*Math.PI*2;
      const line=new THREE.Mesh(new THREE.BoxGeometry(1.25,.018,.035),traceMat);
      line.position.set(Math.cos(a)*1.45,.15,Math.sin(a)*1.45);
      line.rotation.y=-a;lower.add(line);
    }

    // Six precision support posts between the two cryogenic plates.
    const posts=[];
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2;
      const x=Math.cos(a)*2.05,z=Math.sin(a)*2.05;
      const p=new THREE.Group();p.position.set(x,0,z);
      const shaft=cyl(.075,2.0,silver,24);p.add(shaft);
      const topCap=cyl(.16,.18,copper,32);topCap.position.y=1.02;p.add(topCap);
      const botCap=cyl(.16,.18,copper,32);botCap.position.y=-1.02;p.add(botCap);
      machine.add(p);posts.push(p);
    }

    // Central superconducting resonator: ceramic body, copper rings and cyan energy core.
    const resonator=new THREE.Group();resonator.position.y=.05;machine.add(resonator);
    const body=cyl(.36,1.62,ceramic,48);resonator.add(body);
    const bodyTop=cyl(.47,.12,silver,48);bodyTop.position.y=.84;resonator.add(bodyTop);
    const bodyBottom=cyl(.47,.12,silver,48);bodyBottom.position.y=-.84;resonator.add(bodyBottom);
    for(let i=0;i<9;i++){
      const ring=tor(.43,.045,copper);ring.rotation.x=Math.PI/2;ring.position.y=-.68+i*.17;resonator.add(ring);
    }
    const energy=cyl(.095,1.45,cyan,32);energy.position.y=.02;resonator.add(energy);
    const energyGlow=new THREE.PointLight(0x38e8ff,7,4);energyGlow.position.set(0,.1,.5);resonator.add(energyGlow);

    // Micro-machined component blocks around the resonator.
    const components=new THREE.Group();components.position.y=.08;machine.add(components);
    const compMat=new THREE.MeshPhysicalMaterial({color:0x25313c,metalness:.82,roughness:.2});
    const compTop=new THREE.MeshPhysicalMaterial({color:0xd4a45d,metalness:.9,roughness:.15});
    for(let i=0;i<16;i++){
      const a=i/16*Math.PI*2,r=1.25+(i%2)*.42;
      const g=new THREE.Group();g.position.set(Math.cos(a)*r,.12,Math.sin(a)*r);g.rotation.y=-a;
      const b=new THREE.Mesh(new THREE.BoxGeometry(.28,.12,.46),compMat);g.add(b);
      const c=new THREE.Mesh(new THREE.BoxGeometry(.18,.035,.28),compTop);c.position.y=.078;g.add(c);
      components.add(g);
    }

    // Dense wire harnesses: curved copper wires connect the lower board to the top shield.
    const wires=new THREE.Group();machine.add(wires);
    const wireMat=new THREE.MeshStandardMaterial({color:0xd98532,metalness:.95,roughness:.16});
    const wireCount=34;
    for(let i=0;i<wireCount;i++){
      const a=i/wireCount*Math.PI*2;
      const r=2.15+(i%4)*.13;
      const x=Math.cos(a)*r,z=Math.sin(a)*r;
      const curve=new THREE.CatmullRomCurve3([
        new THREE.Vector3(x,-.72,z),
        new THREE.Vector3(x*.94,-.18,z*.94),
        new THREE.Vector3(x*.72,.52,z*.72),
        new THREE.Vector3(x*.82,1.22,z*.82),
        new THREE.Vector3(x,1.48,z)
      ]);
      const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,20,.012,6,false),wireMat);
      wires.add(tube);
    }
    // Fine vertical control wires inside the chamber.
    const fineMat=new THREE.MeshStandardMaterial({color:0xe6a04a,metalness:.96,roughness:.14});
    for(let i=0;i<18;i++){
      const a=i/18*Math.PI*2;
      const r=1.1+(i%3)*.18;
      const x=Math.cos(a)*r,z=Math.sin(a)*r;
      const wire=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,1.85,6),fineMat);
      wire.position.set(x,.42,z);machine.add(wire);
    }

    // Floating metallic spacers and small screws make the assembly read as manufactured hardware.
    for(let i=0;i<20;i++){
      const a=i/20*Math.PI*2;
      const r=2.78;
      const screw=cyl(.045,.12,silver,16);
      screw.position.set(Math.cos(a)*r,1.46,Math.sin(a)*r);
      lid.add(screw);
    }

    const pointer={x:0,y:0,hover:false,dragging:false,lastX:0,lastY:0,dragY:0,dragX:0};
    const move=e=>{
      const r=el.getBoundingClientRect();
      pointer.x=((e.clientX-r.left)/r.width-.5)*2;
      pointer.y=((e.clientY-r.top)/r.height-.5)*2;
      pointer.hover=true;
      if(pointer.dragging){
        const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;
        pointer.dragY+=dx*.008;
        pointer.dragX+=dy*.005;
        pointer.dragX=Math.max(-.55,Math.min(.45,pointer.dragX));
        pointer.lastX=e.clientX;pointer.lastY=e.clientY;
      }
    };
    const down=e=>{
      pointer.dragging=true;pointer.lastX=e.clientX;pointer.lastY=e.clientY;pointer.hover=true;
      el.setPointerCapture?.(e.pointerId);el.classList.add('is-dragging');
    };
    const up=e=>{
      pointer.dragging=false;el.releasePointerCapture?.(e.pointerId);el.classList.remove('is-dragging');
    };
    const leave=()=>{if(!pointer.dragging)pointer.hover=false};
    el.addEventListener('pointermove',move,{passive:true});
    el.addEventListener('pointerdown',down,{passive:true});
    el.addEventListener('pointerup',up,{passive:true});
    el.addEventListener('pointercancel',up,{passive:true});
    el.addEventListener('pointerenter',move,{passive:true});
    el.addEventListener('pointerleave',leave,{passive:true});

    const resize=()=>{const w=el.clientWidth||1,h=el.clientHeight||1;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
    resize();const ro=new ResizeObserver(resize);ro.observe(el);
    const clock=new THREE.Clock();let raf=0;let split=0;

    const animate=()=>{
      const t=clock.getElapsedTime();
      const target=pointer.hover?1:0;split+=(target-split)*.035;
      const ease=split*split*(3-2*split);
      root.rotation.y+=(pointer.x*.045-root.rotation.y)*.018;
      root.rotation.x+=(-pointer.y*.025-root.rotation.x)*.018;
      // Continuous cinematic rotation; manual dragging is added on top instead of replacing the idle motion.
      const autoY=t*.07;
      const desiredY=pointer.dragY+autoY+pointer.x*.018;
      const desiredX=-.16+pointer.dragX;
      machine.rotation.y+=(desiredY-machine.rotation.y)*.045;
      machine.rotation.x+=(desiredX-machine.rotation.x)*.045;
      machine.position.y=Math.sin(t*.55)*.035;

      layers[0].position.y=-1.45-ease*.52;
      layers[1].position.y=-.75-ease*.2;
      layers[2].position.y=ease*.04;
      layers[3].position.y=.72+ease*.26;
      layers[4].position.y=1.35+ease*.5;
      resonator.position.y=.05+ease*.28;
      components.position.y=.08+ease*.35;
      wires.position.y=ease*.15;
      wires.scale.y=1+ease*.08;
      posts.forEach((p,i)=>{const a=i/6*Math.PI*2;p.position.y=ease*.18;});
      energy.material.emissiveIntensity=2.7+Math.sin(t*3.2)*.8+ease*1.4;
      energyGlow.intensity=6.5+Math.sin(t*2.4)*.8+ease*3;
      rim.intensity=6.5+ease*2;
      renderer.render(scene,camera);raf=requestAnimationFrame(animate);
    };
    animate();

    return()=>{
      cancelAnimationFrame(raf);ro.disconnect();
      el.removeEventListener('pointermove',move);el.removeEventListener('pointerdown',down);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('pointerenter',move);el.removeEventListener('pointerleave',leave);
      renderer.dispose();
      scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});
      if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);
    };
  },[]);
  return <div className='quantum-hero-scene' ref={ref} aria-label='Interactive superconducting quantum computer visualization'/>;
}
