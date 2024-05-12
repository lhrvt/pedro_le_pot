

document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var myButton = document.getElementById("myButton");
    
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(20, 15, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);


    
    var hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);

// Définir les couleurs pour la partie supérieure et inférieure de la sphère
        hemiLight.diffuse = new BABYLON.Color3(0.5, 0.2, 0.2); // Couleur diffuse pour la partie supérieure
        hemiLight.groundColor = new BABYLON.Color3(1, 1, 1); // Couleur diffuse pour la partie inférieure
        hemiLight.intensity = 1;

        var sunLight = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(0, -1, 0), scene);
        sunLight.position = new BABYLON.Vector3(0, 10, 0); // Positionner la lumière
        sunLight.intensity =5;

                // Définir la couleur et l'intensité de la lumière
        sunLight.diffuse = new BABYLON.Color3(1, 1, 1); // Couleur blanche
        

// Activer les ombres pour la lumière directionnelle
        sunLight.shadowEnabled = true;

    

    var time = 0;
    var characterSpeed = 0.09;
   

    var invisibleMaterial = new BABYLON.StandardMaterial("invisibleMaterial", scene);
    invisibleMaterial.alpha = 0; // Réglez l'opacité à zéro pour le rendre invisible

    
    var material_obs = new BABYLON.StandardMaterial("material", scene);
    material_obs.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.4); // Rouge

    var material_ground = new BABYLON.StandardMaterial("material", scene);
    material_ground.diffuseColor = new BABYLON.Color3(0.7, 1, 0.9); // Rouge


    

    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    ground.position = new BABYLON.Vector3(0, 0,0);
    var groundPhysics = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene);
    var empty = BABYLON.MeshBuilder.CreateBox("empty", { size: 1.8 }, scene);
    var obstacle = BABYLON.MeshBuilder.CreateBox("obstaclezs", { size: 4 }, scene);
    var obstaclephysics = new BABYLON.PhysicsImpostor(obstacle, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene);
    
    var characterPhysics = new BABYLON.PhysicsImpostor(empty, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.2 }, scene);
    characterPhysics.freezeRotation = true;
    characterPhysics.rotationQuaternion = null;
    empty.position = new BABYLON.Vector3(0, 5,0);
    

    
    empty.material = invisibleMaterial;
    obstacle.material = material_obs;
    ground.material = material_ground;
    characterPhysics.mass = 10;

    

    
    // const xr =  scene.createDefaultXRExperienceAsync({
    //     // ask for an ar-session
    //     uiOptions: {
    //       sessionMode: "immersive-ar",
    //     },
    //   });

var currentAnimationIndex = 0;

function changeAnimationSmoothly(newIndex) {
    var currentAnimation = animations[currentAnimationIndex];
    var newAnimation = animations[newIndex];

    // Vérifie si les animations existent
    if (!currentAnimation || !newAnimation) {
        return;
    }

    // Vérifie si la nouvelle animation est déjà en cours de lecture
    if (currentAnimationIndex === newIndex) {
   return;
    }

    // Stoppe l'animation actuelle
    currentAnimation.stop();

    // Démarre la nouvelle animation
    newAnimation.play(true);

    // Met à jour l'index de l'animation actuelle
    currentAnimationIndex = newIndex;

}

    var animations = {};
        BABYLON.SceneLoader.ImportMesh(null, "./asset/", "pedro.glb", scene, function (meshes, particleSystems, skeletons, animationGroups) {
            rocher = meshes[0];
            rocher.position = new BABYLON.Vector3(0, 0,0);
         
            
            rocher.scaling.z = 1
            rocher.rotationQuaternion = null;
            
            rocher.receiveShadows = true;
            rocher.castShadow = true;
            
            gsap.to(rocher.rotation, {y:-6.2, duration:0.01})
            animationGroups.forEach(function(animationGroup, index) {
                animations[index] = animationGroup;
            });
            
            
            
            if(rocher){
                rocher.parent = empty;
                
    
            }
           
        });
        
                          
                            
               
        var distance;
        function calculateDistance(obj1, obj2) {
                
            var pos1 = obj1.position.y;
            var pos2 = obj2.position.y;

            distance = pos1 + pos2;

            return distance; 
        }

            

        scene.onPointerObservable.add(function(eventData) {
            if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {

                var clic_obj = eventData.pickInfo.pickedMesh;
        
                if (clic_obj) {
                    console.log("Vous avez cliqué sur le mesh : ", clic_obj.name);
                }
            }
        });
        
        const leftJoystick = new BABYLON.VirtualJoystick();
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;

        
        
        leftJoystick.setPosition(screenWidth -100, screenHeight - 200);
        leftJoystick.setScale
        leftJoystick.alwaysVisible = true;
        leftJoystick.containerSize = 50;
        leftJoystick.puckSize = 25;
        

        
        leftJoystick.setJoystickColor("purple");
        

        var ausol;
        var jumping = false;

        var moveSpeed = 0.07;
        function handleJoystickMovement(joystick, character, moveSpeed) {

            if (joystick.pressed) {
                changeAnimationSmoothly(0);
                var horizontalInput = joystick.deltaPosition.y;
                var verticalInput = joystick.deltaPosition.x;
                
                var movementDirection = new BABYLON.Vector3(horizontalInput, 0, verticalInput).normalize();
            
                character.position.x -= movementDirection.x * moveSpeed;
                character.position.z += movementDirection.z * moveSpeed;
                
                var targetRotation = Math.atan2(-movementDirection.z, -movementDirection.x);
                var rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(targetRotation, 0, 0);
                character.rotationQuaternion = rotationQuaternion;
            } else if(!jumping){

                //console.log("PAS USED");
                changeAnimationSmoothly(2);
            }
        }
        myButton.addEventListener("click", function () {

            if (ausol) {
                jumping = true;
                animations[3].play(false); // Lancer l'animation
            
                // Attendre que l'animation soit terminée
                animations[3].onAnimationEndObservable.addOnce(() => {
                    console.log("L'animation de saut est terminée !");
                    
                    // Une fois que l'animation est terminée, exécuter la fonction et lancer une autre animation
                    setTimeout(function() {
                        changeAnimationSmoothly(1); // Changer l'animation
                        characterPhysics.applyImpulse(new BABYLON.Vector3(0, 75, 0), empty.position); // Appliquer une impulsion
        
                    }, 0); // Délai avant de changer l'animation
                });
            
                // Réinitialiser jumping après un certain délai
                setTimeout(function() {
                    jumping = false;
                }, 500); // Délai en millisecondes
            }
           
        });
        
        engine.runRenderLoop(function () {
            scene.render();

            console.log("jumng" + jumping);
            handleJoystickMovement(leftJoystick, empty, moveSpeed);

            empty.rotationQuaternion.x = 0;
            empty.rotationQuaternion.z = 0;
    
            calculateDistance(empty, ground);
            if(distance < 1){
                ausol = true 
            }
            else{
                ausol = false;
            }
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    });
