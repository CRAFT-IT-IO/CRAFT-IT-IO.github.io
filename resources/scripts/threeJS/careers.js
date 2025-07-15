class MemorySafeNetwork {
    constructor() {
        this.canvas = document.getElementById('careerIllustration');
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: false,
            alpha: true,
            powerPreference: "low-power"
        });
        
        // Paramètres réduits pour stabilité
        this.numParticles = 25;
        this.maxConnections = 20; // Réduit drastiquement
        this.connectionDistance = 80;
        this.networkRadius = Math.min(window.innerWidth, window.innerHeight) * 0.15;
        
        this.time = 0;
        
        // Interaction souris
        this.mouseInfluence = new THREE.Vector3(0, 0, 0);
        this.mouseInfluenceRadius = 100;
        this.mouseInfluenceStrength = 0.02;
        this.hasMouseMoved = false;
        
        // Arrays pour les positions et vélocités
        this.positions = new Float32Array(this.numParticles * 3);
        this.velocities = new Float32Array(this.numParticles * 3);
        this.opacities = new Float32Array(this.numParticles);
        this.targetOpacities = new Float32Array(this.numParticles);
        
        // POOL DE CONNEXIONS RÉUTILISÉES (pas de création/destruction)
        this.connectionPool = [];
        this.activeConnections = [];
        
        try {
            this.init();
            this.createParticles();
            this.createConnectionPool();
            this.animate();
            this.setupEventListeners();
        } catch (error) {
            console.warn('Erreur Three.js, utilisation du fallback');
            this.useFallback();
        }
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(0x000000, 0);
        
        this.camera.position.z = 300;
        
        // Créer la géométrie des points
        this.particleGeometry = new THREE.BufferGeometry();
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        
        // Matériau des points
        this.particleMaterial = new THREE.PointsMaterial({
            color: 0x2c2c2c,
            size: 3,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: false
        });
        
        // Créer le nuage de points
        this.pointCloud = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.pointCloud);
        
        // Matériau pour les connexions (UN SEUL réutilisé)
        this.lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x2c2c2c,
            transparent: true,
            opacity: 0.2
        });
    }
    
    // CRÉER UN POOL DE CONNEXIONS RÉUTILISABLES
    createConnectionPool() {
        for (let i = 0; i < this.maxConnections; i++) {
            // Créer une géométrie de ligne réutilisable
            const positions = new Float32Array(6); // 2 points * 3 coordonnées
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const line = new THREE.Line(geometry, this.lineMaterial.clone());
            line.visible = false; // Invisible par défaut
            
            this.scene.add(line);
            this.connectionPool.push({
                line: line,
                geometry: geometry,
                positions: positions,
                inUse: false
            });
        }
    }
    
    createParticles() {
        // Initialiser les positions et vélocités
        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3;
            
            // Position aléatoire dans un cercle
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * this.networkRadius;
            
            this.positions[i3] = Math.cos(angle) * radius;
            this.positions[i3 + 1] = Math.sin(angle) * radius;
            this.positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            // Vélocité initiale
            this.velocities[i3] = (Math.random() - 0.5) * 0.3;
            this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
            this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
            
            // Opacité
            this.opacities[i] = 0;
            this.targetOpacities[i] = 0.7 + Math.random() * 0.2;
        }
        
        this.particleGeometry.attributes.position.needsUpdate = true;
    }
    
    updateParticles() {
        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3;
            
            // Animation d'apparition
            if (this.opacities[i] < this.targetOpacities[i]) {
                this.opacities[i] += 0.02;
            }
            
            // Mouvement organique
            this.positions[i3] += this.velocities[i3];
            this.positions[i3 + 1] += this.velocities[i3 + 1];
            this.positions[i3 + 2] += this.velocities[i3 + 2];
            
            // Influence de la souris
            if (this.hasMouseMoved) {
                const dx = this.positions[i3] - this.mouseInfluence.x;
                const dy = this.positions[i3 + 1] - this.mouseInfluence.y;
                const dz = this.positions[i3 + 2] - this.mouseInfluence.z;
                const mouseDistance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if (mouseDistance < this.mouseInfluenceRadius && mouseDistance > 0) {
                    const influence = Math.max(0, 1 - mouseDistance / this.mouseInfluenceRadius);
                    const forceScale = this.mouseInfluenceStrength * influence;
                    
                    this.velocities[i3] += (dx / mouseDistance) * forceScale;
                    this.velocities[i3 + 1] += (dy / mouseDistance) * forceScale;
                    this.velocities[i3 + 2] += (dz / mouseDistance) * forceScale;
                }
            }
            
            // Oscillation naturelle
            this.positions[i3] += Math.sin(this.time * 0.002 + i) * 0.05;
            this.positions[i3 + 1] += Math.cos(this.time * 0.0015 + i * 0.5) * 0.05;
            
            // Rebond sur les bords
            const distance = Math.sqrt(this.positions[i3]*this.positions[i3] + this.positions[i3 + 1]*this.positions[i3 + 1]);
            if (distance > this.networkRadius) {
                const norm = this.networkRadius / distance;
                this.velocities[i3] += (this.positions[i3] * norm - this.positions[i3]) * 0.01;
                this.velocities[i3 + 1] += (this.positions[i3 + 1] * norm - this.positions[i3 + 1]) * 0.01;
            }
            
            // Amortissement
            this.velocities[i3] *= 0.995;
            this.velocities[i3 + 1] *= 0.995;
            this.velocities[i3 + 2] *= 0.995;
        }
        
        this.particleGeometry.attributes.position.needsUpdate = true;
    }
    
    // RÉUTILISER LES CONNEXIONS EXISTANTES (pas de création/destruction)
    updateConnections() {
        // Mise à jour moins fréquente
        if (this.time % 8 !== 0) return;
        
        // Remettre toutes les connexions en pool
        this.connectionPool.forEach(conn => {
            conn.inUse = false;
            conn.line.visible = false;
        });
        
        // Calculer les nouvelles connexions et réutiliser le pool
        let usedConnections = 0;
        
        for (let i = 0; i < this.numParticles && usedConnections < this.maxConnections; i++) {
            for (let j = i + 1; j < this.numParticles && usedConnections < this.maxConnections; j++) {
                const i3 = i * 3;
                const j3 = j * 3;
                
                const dx = this.positions[i3] - this.positions[j3];
                const dy = this.positions[i3 + 1] - this.positions[j3 + 1];
                const dz = this.positions[i3 + 2] - this.positions[j3 + 2];
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if (distance < this.connectionDistance) {
                    // Réutiliser une connexion du pool
                    const conn = this.connectionPool[usedConnections];
                    
                    // Mettre à jour les positions dans le buffer existant
                    conn.positions[0] = this.positions[i3];
                    conn.positions[1] = this.positions[i3 + 1];
                    conn.positions[2] = this.positions[i3 + 2];
                    conn.positions[3] = this.positions[j3];
                    conn.positions[4] = this.positions[j3 + 1];
                    conn.positions[5] = this.positions[j3 + 2];
                    
                    // Mettre à jour l'opacité
                    const opacity = (1 - distance / this.connectionDistance) * 0.25;
                    conn.line.material.opacity = opacity;
                    
                    // Marquer comme utilisé et visible
                    conn.inUse = true;
                    conn.line.visible = true;
                    conn.geometry.attributes.position.needsUpdate = true;
                    
                    usedConnections++;
                }
            }
        }
    }
    
    animate() {
        if (!this.renderer) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.time++;
        
        this.updateParticles();
        this.updateConnections();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    useFallback() {
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.fallbackParticles = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 120;
            
            this.fallbackParticles.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: 0
            });
        }
        
        this.fallbackMouse = { x: centerX, y: centerY };
        this.animateFallback(ctx);
    }
    
    animateFallback(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#2c2c2c';
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.fallbackParticles.forEach((p, i) => {
            p.opacity = Math.min(p.opacity + 0.02, 0.8);
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Influence souris
            if (this.hasMouseMoved) {
                const mouseDistance = Math.hypot(p.x - this.fallbackMouse.x, p.y - this.fallbackMouse.y);
                if (mouseDistance < 80 && mouseDistance > 0) {
                    const influence = 1 - mouseDistance / 80;
                    const repulsionX = (p.x - this.fallbackMouse.x) / mouseDistance;
                    const repulsionY = (p.y - this.fallbackMouse.y) / mouseDistance;
                    p.vx += repulsionX * 0.015 * influence;
                    p.vy += repulsionY * 0.015 * influence;
                }
            }
            
            // Oscillation
            p.x += Math.sin(this.time * 0.015 + i) * 0.05;
            p.y += Math.cos(this.time * 0.012 + i * 0.5) * 0.05;
            
            // Rebond
            const distance = Math.hypot(p.x - centerX, p.y - centerY);
            if (distance > 120) {
                const dx = centerX - p.x;
                const dy = centerY - p.y;
                const dist = Math.hypot(dx, dy);
                p.vx += (dx / dist) * 0.01;
                p.vy += (dy / dist) * 0.01;
            }
            
            p.vx *= 0.995;
            p.vy *= 0.995;
            
            // Dessiner particule
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Connexions (limitées)
            if (i % 2 === 0) { // Seulement la moitié des particules font des connexions
                for (let j = i + 1; j < Math.min(i + 3, this.fallbackParticles.length); j++) {
                    const other = this.fallbackParticles[j];
                    const dist = Math.hypot(p.x - other.x, p.y - other.y);
                    if (dist < 60) {
                        ctx.globalAlpha = (1 - dist/60) * 0.25;
                        ctx.strokeStyle = '#2c2c2c';
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            }
        });
        
        this.time++;
        requestAnimationFrame(() => this.animateFallback(ctx));
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Cleanup au déchargement de la page
        window.addEventListener('beforeunload', () => this.cleanup());
    }
    
    cleanup() {
        // Nettoyer les ressources
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.particleGeometry) {
            this.particleGeometry.dispose();
        }
        this.connectionPool.forEach(conn => {
            if (conn.geometry) {
                conn.geometry.dispose();
            }
            if (conn.line.material) {
                conn.line.material.dispose();
            }
        });
    }
    
    onMouseMove(event) {
        this.hasMouseMoved = true;
        
        this.mouseInfluence.set(
            (event.clientX - window.innerWidth / 2) * 0.3,
            -(event.clientY - window.innerHeight / 2) * 0.3,
            0
        );
        
        if (this.fallbackMouse) {
            this.fallbackMouse.x = event.clientX;
            this.fallbackMouse.y = event.clientY;
        }
    }
    
    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

// Initialiser
new MemorySafeNetwork();