/**
 * Simple Template Renderer for Resume Generator
 * Populates HTML templates with JSON data
 */

class TemplateRenderer {
  /**
   * Render a template with data
   * @param {string} templateHtml - The HTML template string
   * @param {object} data - Resume data object
   * @returns {string} Rendered HTML
   */
  static render(templateHtml, data) {
    let html = templateHtml;

    // Replace personal info
    html = html.replace(/{{name}}/g, data.personalInfo.name || '');
    html = html.replace(/{{title}}/g, data.personalInfo.title || '');
    html = html.replace(/{{email}}/g, data.personalInfo.email || '');
    html = html.replace(/{{phone}}/g, data.personalInfo.phone || '');
    html = html.replace(/{{location}}/g, data.personalInfo.location || '');
    html = html.replace(/{{website}}/g, data.personalInfo.website || '');
    html = html.replace(/{{initials}}/g, data.personalInfo.initials || '');
    html = html.replace(/{{summary}}/g, data.summary || '');

    // Replace professional links
    html = this.replaceProfessionalLinks(html, data.professionalLinks || []);

    // Replace experience section
    html = this.replaceExperience(html, data.experience || []);

    // Replace projects section
    html = this.replaceProjects(html, data.projects || []);

    // Replace education section
    html = this.replaceEducation(html, data.education || []);

    // Replace skills
    html = this.replaceSkills(html, data.skills || {});

    // Replace languages
    html = this.replaceLanguages(html, data.languages || []);

    // Replace certifications
    html = this.replaceCertifications(html, data.certifications || []);

    // Replace achievements
    html = this.replaceAchievements(html, data.achievements || []);

    // Replace volunteer experience
    html = this.replaceVolunteer(html, data.volunteer || []);

    return html;
  }

  static replaceProfessionalLinks(html, links) {
    if (!links.length) return html;

    const linksHtml = links.map(link => `
      <div class="link-item">
        <span>${link.icon}</span>
        <span>${link.url}</span>
      </div>
    `).join('');

    return html.replace(/{{professionalLinks}}/g, linksHtml);
  }

  static replaceExperience(html, experience) {
    if (!experience.length) return html;

    const expHtml = experience.map(exp => `
      <div class="experience-item">
        <div class="entry-header">
          <h3 class="job-title entry-title">${exp.title}</h3>
          <span class="date entry-date">${exp.date}</span>
        </div>
        <p class="company entry-company">${exp.company}</p>
        <p class="description entry-description">${exp.description}</p>
      </div>
    `).join('');

    return html.replace(/{{experience}}/g, expHtml);
  }

  static replaceProjects(html, projects) {
    if (!projects.length) return html;

    const projectsHtml = projects.map(project => {
      const techTags = project.tech ? project.tech.map(tech => 
        `<span class="tech-tag">${tech}</span>`
      ).join('') : '';

      const projectLinks = project.links ? project.links.map(link =>
        `<a href="${link.url}" class="project-link">${link.icon} ${link.label}</a>`
      ).join('') : '';

      return `
        <div class="project-item project-entry">
          <div class="entry-header">
            <h3 class="project-title entry-title">${project.title}</h3>
            <span class="date entry-date">${project.date}</span>
          </div>
          ${project.tech ? `<div class="project-tech">${techTags}</div>` : ''}
          <p class="description entry-description">${project.description}</p>
          ${projectLinks ? `<div class="project-links">${projectLinks}</div>` : ''}
        </div>
      `;
    }).join('');

    return html.replace(/{{projects}}/g, projectsHtml);
  }

  static replaceEducation(html, education) {
    if (!education.length) return html;

    const eduHtml = education.map(edu => `
      <div class="education-item education-entry">
        <div class="entry-header">
          <h3 class="degree entry-title">${edu.degree}</h3>
          <span class="date entry-date">${edu.date}</span>
        </div>
        <p class="school entry-company">${edu.school}</p>
        <p class="description entry-description">${edu.description}</p>
      </div>
    `).join('');

    return html.replace(/{{education}}/g, eduHtml);
  }

  static replaceSkills(html, skills) {
    // Handle grouped skills (for sidebar template)
    if (skills.grouped && skills.grouped.length) {
      const groupedSkillsHtml = skills.grouped.map(group => `
        <div class="skill-group">
          <h4 class="skill-group-title">${group.category}</h4>
          <ul class="skill-list">
            ${group.items.map(item => `<li class="skill-item">${item}</li>`).join('')}
          </ul>
        </div>
      `).join('');
      html = html.replace(/{{skillsGrouped}}/g, groupedSkillsHtml);
    }

    // Handle flat skills (for two-column template)
    if (skills.flat && skills.flat.length) {
      const flatSkillsHtml = skills.flat.map(skill => 
        `<li class="skill-item">${skill}</li>`
      ).join('');
      html = html.replace(/{{skillsFlat}}/g, flatSkillsHtml);
    }

    return html;
  }

  static replaceLanguages(html, languages) {
    if (!languages.length) return html;

    const langsHtml = languages.map(lang => `
      <li class="language-item">
        <span class="language-name">${lang.name}</span>
        <span class="proficiency language-level">${lang.level}</span>
      </li>
    `).join('');

    return html.replace(/{{languages}}/g, langsHtml);
  }

  static replaceCertifications(html, certifications) {
    if (!certifications.length) return html;

    const certsHtml = certifications.map(cert => `
      <li class="certification-item">
        <div class="cert-name">${cert.name}</div>
        <div class="cert-issuer">${cert.issuer} (${cert.year})</div>
      </li>
    `).join('');

    return html.replace(/{{certifications}}/g, certsHtml);
  }

  static replaceAchievements(html, achievements) {
    if (!achievements.length) return html;

    const achievementsHtml = achievements.map(achievement => `
      <div class="achievement-card">
        <h4 class="achievement-title">${achievement.title}</h4>
        <p class="achievement-desc">${achievement.description}</p>
      </div>
    `).join('');

    return html.replace(/{{achievements}}/g, achievementsHtml);
  }

  static replaceVolunteer(html, volunteer) {
    if (!volunteer.length) return html;

    const volunteerHtml = volunteer.map(vol => `
      <div class="volunteer-item volunteer-entry">
        <h3 class="volunteer-role">${vol.role}</h3>
        <p class="volunteer-org">${vol.organization} • ${vol.date}</p>
        <p class="description entry-description">${vol.description}</p>
      </div>
    `).join('');

    return html.replace(/{{volunteer}}/g, volunteerHtml);
  }
}

// Export for use in other modules or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TemplateRenderer;
}
