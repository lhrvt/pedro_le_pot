document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(20, 20, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);


    var hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);

// Définir les couleurs pour la partie supérieure et inférieure de la sphère
        hemiLight.diffuse = new BABYLON.Color3(0.5, 0.2, 0.2); // Couleur diffuse pour la partie supérieure
        hemiLight.groundColor = new BABYLON.Color3(1, 1, 1); // Couleur diffuse pour la partie inférieure
        hemiLight.intensity = 1;

        var sunLight = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(0, -1, 0), scene);
        sunLight.position = new BABYLON.Vector3(0, 10, 0); // Positionner la lumière
        sunLight.intensity =7;

                // Définir la couleur et l'intensité de la lumière
        sunLight.diffuse = new BABYLON.Color3(1, 1, 1); // Couleur blanche
        

// Activer les ombres pour la lumière directionnelle
        sunLight.shadowEnabled = true;

    

    var time = 0;
    var characterSpeed = 0.09;
   

    var invisibleMaterial = new BABYLON.StandardMaterial("invisibleMaterial", scene);
    invisibleMaterial.alpha = 0.2; // Réglez l'opacité à zéro pour le rendre invisible

    

    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    ground.position = new BABYLON.Vector3(0, 0,0);
    var groundPhysics = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene);
    var empty = BABYLON.MeshBuilder.CreateBox("empty", { size: 1.8 }, scene);
    var obstacle = BABYLON.MeshBuilder.CreateBox("obstaclezs", { size: 1.8 }, scene);
    var obstaclephysics = new BABYLON.PhysicsImpostor(obstacle, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene);
    
    var characterPhysics = new BABYLON.PhysicsImpostor(empty, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.2 }, scene);
    characterPhysics.freezeRotation = true;
    characterPhysics.rotationQuaternion = null;
    empty.position = new BABYLON.Vector3(0, 5,0);
    
    empty.material = invisibleMaterial;
    characterPhysics.mass = 10;

   


    // Character
    
    // Keyboard input
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {		
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {		
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    
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
        
        BABYLON.SceneLoader.ImportMesh(null, "./asset/", "scene.glb", scene, function (meshes,) {
            terrain = meshes[0];
            terrain.position = new BABYLON.Vector3(0, 0,0);
         
            
            
            ;
            terrain.castShadow = true;
            if(terrain){
                //var terrainPhysics = new BABYLON.PhysicsImpostor(meshes[0], BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.5 }, scene);
            }
            

           
        });
      
                                // Objet pour stocker l'état des touches du clavier
                                var keys = {};

                                // Fonction appelée lorsqu'une touche est enfoncée
                                document.addEventListener('keydown', function(event) {
                                    // Enregistre l'état de la touche enfoncée dans l'objet keys
                                    keys[event.key] = true;
                                });
                                
                                // Fonction appelée lorsqu'une touche est relâchée
                                document.addEventListener('keyup', function(event) {
                                    // Met à jour l'état de la touche relâchée dans l'objet keys
                                    keys[event.key] = false;
                                });
                                
                                // Fonction pour vérifier si une touche est enfoncée
                                function isKeyDown(key) {
                                    return keys[key];
                                }
                                
                                // Exemple d'utilisation
                                setInterval(function() {
                                    if (isKeyDown('z') || isKeyDown('q') || isKeyDown('s') || isKeyDown('d')   ) {
                                        changeAnimationSmoothly(0);
                                    } else if (isKeyDown('w') && ausol) {
                                        // Jouer l'animation de préparation du saut
                                        animations[1].play(false);
                                    } else {
                                        changeAnimationSmoothly(2);
                                    }
                                }, 10);
                                
                          
                                

               
                var distance;
                function calculateDistance(obj1, obj2) {
                // Récupérer les positions des deux objets
                var pos1 = obj1.position.y;
                var pos2 = obj2.position.y;
                
                // Calculer la distance entre les deux objets
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
        var ausol;
        const leftJoystick = new BABYLON.VirtualJoystick(true,joystickOptions);
        var joystickOptions = {
            position: { left: '50%', bottom: '50%' }, // Position centrée
            color: 'red' // Couleur personnalisée
        };

        var moveSpeed = 0.1;
        var rotationSpeed = 0.1;; 
        leftJoystick.setJoystickColor("red")
        

        
        engine.runRenderLoop(function () {

           

            scene.render();
            var horizontalInput = leftJoystick.deltaPosition.y;
            var verticalInput = leftJoystick.deltaPosition.x;

            var movementDirection = new BABYLON.Vector3(horizontalInput, 0, verticalInput).normalize();

            empty.position.x -= movementDirection.x * moveSpeed;
            empty.position.z += movementDirection.z * moveSpeed;
           
            var targetRotation = Math.atan2(-movementDirection.z, -movementDirection.x);

            var rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(targetRotation, 0, 0);
            empty.rotationQuaternion = rotationQuaternion;



            if (inputMap["w"] && ausol) {
                characterPhysics.applyImpulse(
                    new BABYLON.Vector3(0, 10, 0), // direction and magnitude of the applied impulse
                    empty.position   
                );
                
            }


            empty.rotationQuaternion.x = 0;
            empty.rotationQuaternion.z = 0;
            //empty.rotationQuaternion.y = 0;
    

            
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
