// main()
window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var scene = createScene(canvas, engine);
    scene.actor = getActorMesh(scene);
    scene.camera = getActorFollowCamera(scene);
    setupKeyboardActionMap(scene);

    engine.runRenderLoop(function(){
        scene.render();
    });

    window.addEventListener('resize', function(){
        engine.resize();
    });

});

function getActorMesh(scene){
    for (let i = 0; i < scene.meshes.length; i++){
        if (scene.meshes[i].id === 'actor'){
            console.log('found and declared playable actor\'s mesh');
            return scene.meshes[i];
        }
    }
    console.log('ERROR: Playable Actor\'s mesh is not found in scene.meshes array.\n' + scene.meshes);
}

function getActorFollowCamera(scene){
    for (let i = 0; i < scene.meshes.length; i++){
        if (scene.cameras[i].id === 'followCamera'){
            console.log('found and defined playable actor\'s follow camera');
            return scene.cameras[i];
        }
    }
    console.log('ERROR: Playable Actor\'s follow camera is not found in scene.camera[].\n' + scene.cameras);
}

function setupKeyboardActionMap(scene){

    let inputMap ={};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    scene.onBeforeRenderObservable.add(()=>{
        //console.log(inputMap);
        if(inputMap["w"] || inputMap["ArrowUp"]){
            scene.actor.position.z += Math.cos(scene.actor.rotation.y)/10;
            scene.actor.position.x += Math.sin(scene.actor.rotation.y)/10;
        } 
        if(inputMap["a"] || inputMap["ArrowLeft"]){
            scene.actor.position.z += Math.sin(scene.actor.rotation.y)/10;
            scene.actor.position.x -= Math.cos(scene.actor.rotation.y)/10;
        } 
        if(inputMap["s"] || inputMap["ArrowDown"]){
            scene.actor.position.z -= Math.cos(scene.actor.rotation.y)/10;
            scene.actor.position.x -= Math.sin(scene.actor.rotation.y)/10;
        } 
        if(inputMap["d"] || inputMap["ArrowRight"]){
            scene.actor.position.z -= Math.sin(scene.actor.rotation.y)/10;
            scene.actor.position.x += Math.cos(scene.actor.rotation.y)/10;
        }    
        if(inputMap["q"]){
            scene.actor.rotation.y += .075;
        } else if (inputMap["e"]){
            scene.actor.rotation.y -= .075;
        } 
        //debugging hitbox
        if(inputMap["i"]){
            scene.actor.isVisible = !scene.actor.isVisible;
        }
    });
}


function createScene(canvas, engine) {
    let scene = new BABYLON.Scene(engine);

    let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
    light.intensity = .7;
    let actor = new BABYLON.MeshBuilder.CreateBox('actor', {height:.8, width:.6, depth:.5}, scene);
    actor.position.y = .49;
    let ground = new BABYLON.MeshBuilder.CreateGround('ground', {height:6, width:6, subdivisions:2}, scene); 
    let camera = setupPlayerFollowCamera(scene, actor, canvas);


    var spriteManagerPlayer = new BABYLON.SpriteManager("playerManager", "free sprites\\dungeon\\0x72_16x16DungeonTileset-245.png", 1, 16, scene);

    var player = new BABYLON.Sprite("player", spriteManagerPlayer);
    player.position = actor.position;
    console.dir(actor);
    return scene;
}

function setupPlayerFollowCamera(scene, actor, canvas){
    let camera = new BABYLON.FollowCamera('followCamera', new BABYLON.Vector3(0, 5, -10), scene);
    camera.radius = -10;
    camera.lowerRadiusLimit = camera.radius;
    camera.upperRadiusLimit = camera.radius;
    camera.heightOffset = 5;
    camera.lowerHeightOffsetLimit = 1;
    camera.upperHeightOffsetLimit = 10;
    camera.attachControl(canvas, true);
    camera.lockedTarget = actor;
    camera.inputs.remove(camera.inputs.attached.pointers);
    return camera
}