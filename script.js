
// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    
    // Futuristic cursor effect
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hover effects
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    // Page-specific logic
    if (document.getElementById('listaProvas')) {
        loadExams();
    } else if (document.getElementById('listaProjetos')) {
        loadProjects();
    }
});

// Exams Page Logic
let allExams = [];
let allProjects = [];

async function loadExams() {
    try {
        const response = await fetch('dados.json?' + new Date().getTime());
        allExams = await response.json();
        renderExams(allExams);
    } catch (error) {
        console.error("Error loading exams:", error);
        showError('listaProvas', 'Nenhuma prova encontrada no servidor.');
    }
}

function renderExams(exams) {
    const container = document.getElementById('listaProvas');
    if (!container) return;

    container.innerHTML = exams.length === 0 
        ? showEmptyState('listaProvas', 'Nenhuma prova encontrada com esses critérios.')
        : exams.map((exam, index) => createExamCard(exam, index)).join('');
    
    feather.replace();
}

function createExamCard(exam, index) {
    const formattedSubject = exam.materia.charAt(0).toUpperCase() + exam.materia.slice(1);
    return `
        <div class="prova-card animate__animated animate__fadeIn" style="animation-delay: ${index * 50}ms">
            <div class="prova-header">
                <h3>${formattedSubject}</h3>
                <span class="prova-tag">${exam.tipo}</span>
            </div>
            <div class="prova-details">
                <p><i data-feather="user"></i> Prof. ${exam.professor}</p>
                <p><i data-feather="calendar"></i> ${exam.ano}</p>
            </div>
            <a href="${exam.arquivo}" target="_blank" class="btn-download">
                <i data-feather="eye"></i> Ver PDF
            </a>
        </div>
    `;
}

// Projects Page Logic
async function loadProjects() {
    try {
        const response = await fetch('projetos.json?' + new Date().getTime());
        allProjects = await response.json();
        renderProjects(allProjects);
    } catch (error) {
        console.error("Error loading projects:", error);
        showError('listaProjetos', 'Nenhum projeto encontrado no servidor.');
    }
}

function renderProjects(projects) {
    const container = document.getElementById('listaProjetos');
    if (!container) return;

    container.innerHTML = projects.length === 0 
        ? showEmptyState('listaProjetos', 'Nenhum projeto encontrado com esses critérios.')
        : projects.map((project, index) => createProjectCard(project, index)).join('');
    
    feather.replace();
}

function createProjectCard(project, index) {
    const tags = project.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
    return `
        <div class="project-card animate__animated animate__fadeIn" style="animation-delay: ${index * 50}ms">
            <div class="project-icon">
                <i data-feather="code"></i>
            </div>
            <div class="project-content">
                <h3>${project.titulo}</h3>
                <p class="project-author">Por: ${project.autor}</p>
                <div class="project-tags">${tags}</div>
                <a href="${project.arquivo}" target="_blank" class="btn-download">
                    <i data-feather="download"></i> Ver Projeto
                </a>
            </div>
        </div>
    `;
}

// Search functionality
document.getElementById('searchBar')?.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allExams.filter(exam => 
        exam.materia.toLowerCase().includes(term) || 
        exam.professor.toLowerCase().includes(term) ||
        exam.ano.includes(term)
    );
    renderExams(filtered);
});

document.getElementById('searchProjetos')?.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProjects.filter(project => 
        project.titulo.toLowerCase().includes(term) || 
        project.autor.toLowerCase().includes(term) ||
        project.tags.toLowerCase().includes(term)
    );
    renderProjects(filtered);
});

// Helper functions
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="col-span-full text-center p-8 rounded-xl bg-black/50 backdrop-blur border border-[#00f5d4]/20">
                <i data-feather="alert-circle" class="w-12 h-12 mx-auto text-[#00f5d4] mb-4"></i>
                <p class="text-lg text-gray-300">${message}</p>
            </div>
        `;
        feather.replace();
    }
}

function showEmptyState(containerId, message) {
    return `
        <div class="col-span-full text-center p-8 rounded-xl bg-black/50 backdrop-blur border border-[#00f5d4]/20">
            <i data-feather="search" class="w-12 h-12 mx-auto text-[#00f5d4] mb-4"></i>
            <p class="text-lg text-gray-300">${message}</p>
        </div>
    `;
}
