document.addEventListener('DOMContentLoaded', () => {

    // --- Tab Switching Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Also handle dashboard icon buttons in topbar
    const topbarIcons = document.querySelectorAll('.icon-btn[data-target]');

    window.switchTab = function (targetId) {
        // Remove active class from all nav items and tabs
        navItems.forEach(nav => nav.classList.remove('active'));
        const dynamicPanes = document.querySelectorAll('.tab-pane');
        dynamicPanes.forEach(tab => tab.classList.remove('active'));

        // Add active class to corresponding tab
        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Add active class to corresponding nav item in sidebar (if exists)
        const correspondingNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (correspondingNav) {
            correspondingNav.classList.add('active');
        }
    }

    // Attach click events to Sidebar Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            window.switchTab(targetId);
        });
    });

    // Attach click events to Topbar Icons (like Rewards)
    topbarIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = icon.getAttribute('data-target');
            window.switchTab(targetId);
        });
    });

    // --- Modal Logic ---
    const createModal = document.getElementById('create-modal');
    const btnUniversalCreate = document.getElementById('btn-universal-create');
    const inlineCreateTrigger = document.getElementById('inline-create-trigger');

    function openModal() {
        const modal = document.getElementById('create-modal');
        if (modal) modal.classList.add('active');
        window.resetModalView(); // Ensure it opens to the main menu
    }

    // Open from topbar button
    if (btnUniversalCreate) {
        btnUniversalCreate.addEventListener('click', openModal);
    }

    // Open from inline composer on Home Feed
    if (inlineCreateTrigger) {
        const input = inlineCreateTrigger.querySelector('input');
        if (input) input.addEventListener('click', openModal);
    }

    // Close when clicking outside of modal content
    createModal.addEventListener('click', (e) => {
        if (e.target === createModal) {
            window.closeModal();
        }
    });

});

// Global functions for inline HTML event handlers
window.switchCreateView = function (viewId) {
    // Hide all views inside modal-body
    const views = document.querySelectorAll('.create-form-view, #create-view-menu');
    views.forEach(view => {
        if (view) view.style.display = 'none';
    });

    // Show the targeted view
    const target = document.getElementById('create-view-' + viewId);
    if (target) {
        target.style.display = (viewId === 'menu') ? 'grid' : 'block';
    }

    // Update header title based on view
    const titleObj = document.getElementById('modal-title');
    if (!titleObj) return;

    if (viewId === 'menu') titleObj.innerText = 'What would you like to create?';
    else if (viewId === 'update') titleObj.innerText = 'Post an Update';
    else if (viewId === 'event') titleObj.innerText = 'Create an Event';
    else if (viewId === 'job') titleObj.innerText = 'Post a Job';
    else if (viewId === 'offer') titleObj.innerText = 'Offer a Service';
    else if (viewId === 'request') titleObj.innerText = 'Request a Service';
    else if (viewId === 'funding') titleObj.innerText = 'Ask for Funding / Partnership';
    else if (viewId === 'edit-company') titleObj.innerText = 'Edit Company Profile';
};

window.resetModalView = function () {
    window.switchCreateView('menu');
};

window.closeModal = function () {
    window.resetModalView();
    const modals = document.querySelectorAll('.modal-overlay.active');
    modals.forEach(m => m.classList.remove('active'));
};

// Profile Dropdown Logic
window.togglePfpDropdown = function () {
    const dropdown = document.getElementById('pfp-dropdown');
    if (dropdown) {
        dropdown.style.display = (dropdown.style.display === 'none' || dropdown.style.display === '') ? 'block' : 'none';
    }
};

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('pfp-dropdown');
    const trigger = document.getElementById('pfp-trigger');

    if (dropdown && trigger) {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    }
});

// --- Authentication Flow Logic ---
window.switchAuthView = function (viewId) {
    const views = document.querySelectorAll('.auth-form-container');
    views.forEach(v => {
        v.style.display = 'none';
        v.classList.remove('active');
    });

    const target = document.getElementById('auth-view-' + viewId);
    if (target) {
        target.style.display = 'flex';
        // tiny delay for animation feel if needed
        setTimeout(() => target.classList.add('active'), 10);
    }
};

window.populateProfileData = function () {
    const userType = window.localStorage.getItem('currentUserType') || 'individual';

    if (userType === 'individual') {
        const fName = document.getElementById('auth-fname') ? document.getElementById('auth-fname').value.trim() : '';
        const lName = document.getElementById('auth-lname') ? document.getElementById('auth-lname').value.trim() : '';
        const job = document.getElementById('auth-job') ? document.getElementById('auth-job').value.trim() : '';
        const company = document.getElementById('auth-company') ? document.getElementById('auth-company').value.trim() : '';
        const experience = document.getElementById('auth-experience') ? document.getElementById('auth-experience').value.trim() : '';
        const loc = document.getElementById('auth-loc') ? document.getElementById('auth-loc').value.trim() : '';
        const edu = document.getElementById('auth-edu') ? document.getElementById('auth-edu').value.trim() : '';
        const skills = document.getElementById('auth-skills') ? document.getElementById('auth-skills').value.trim() : '';
        const email = document.getElementById('indiv-reg-email') ? document.getElementById('indiv-reg-email').value.trim() : '';

        if (fName || lName) {
            let fullName = fName + (fName && lName ? ' ' : '') + lName;
            if (document.getElementById('prof-fullname')) document.getElementById('prof-fullname').innerText = fullName;
        }
        if (job && document.getElementById('prof-job')) document.getElementById('prof-job').innerText = job;
        if (company && document.getElementById('prof-company')) document.getElementById('prof-company').innerText = company;
        if (loc && document.getElementById('prof-loc')) document.getElementById('prof-loc').innerText = loc;
        if (email && document.getElementById('prof-email')) document.getElementById('prof-email').innerText = email;
        if (email && document.getElementById('indiv-verified-email')) document.getElementById('indiv-verified-email').value = email;
        if (edu && document.getElementById('prof-edu-display')) {
            document.getElementById('prof-edu-display').innerText = edu;
            document.getElementById('prof-edu-display').style.display = 'block';
        }
        if (experience && document.getElementById('prof-experience-display')) {
            document.getElementById('prof-experience-display').innerText = experience;
        }
        if (skills && document.getElementById('prof-skills-display')) {
            const skillsArr = skills.split(',').map(s => s.trim());
            const container = document.getElementById('prof-skills-display');
            container.innerHTML = '';
            skillsArr.forEach(s => {
                const pill = document.createElement('span');
                pill.className = 'pill';
                pill.innerText = s;
                container.appendChild(pill);
            });
        }
    } else {
        // Company Profile Mapping
        const compName = document.getElementById('comp-reg-name') ? document.getElementById('comp-reg-name').value.trim() : '';
        const compType = document.getElementById('comp-reg-type') ? document.getElementById('comp-reg-type').value : '';
        const compDesc = document.getElementById('comp-reg-desc') ? document.getElementById('comp-reg-desc').value.trim() : '';
        const compIndustry = document.getElementById('comp-reg-industry') ? document.getElementById('comp-reg-industry').value : '';
        const compEmail = document.getElementById('comp-reg-email') ? document.getElementById('comp-reg-email').value.trim() : '';
        const compYears = document.getElementById('comp-reg-years') ? document.getElementById('comp-reg-years').value.trim() : '';
        const compGst = document.getElementById('comp-reg-gst') ? document.getElementById('comp-reg-gst').value.trim() : '';
        const compWebsite = document.getElementById('comp-reg-website') ? document.getElementById('comp-reg-website').value.trim() : '';
        const compLinkedin = document.getElementById('comp-reg-linkedin') ? document.getElementById('comp-reg-linkedin').value.trim() : '';

        if (compName && document.getElementById('comp-prof-name')) document.getElementById('comp-prof-name').innerText = compName;
        if (compDesc && document.getElementById('comp-prof-desc')) document.getElementById('comp-prof-desc').innerText = compDesc;
        if (compIndustry && document.getElementById('comp-prof-industry')) document.getElementById('comp-prof-industry').innerText = compIndustry;
        if (compType && document.getElementById('comp-prof-type')) document.getElementById('comp-prof-type').innerText = compType;
        if (compEmail && document.getElementById('comp-prof-email')) document.getElementById('comp-prof-email').innerText = compEmail;
        if (compGst && document.getElementById('comp-prof-gst')) document.getElementById('comp-prof-gst').innerText = compGst;
        if (compYears && document.getElementById('comp-prof-years')) document.getElementById('comp-prof-years').innerText = compYears;
        if (compWebsite && document.getElementById('comp-prof-website')) document.getElementById('comp-prof-website').innerText = compWebsite;
        if (compLinkedin && document.getElementById('comp-prof-linkedin')) document.getElementById('comp-prof-linkedin').innerText = compLinkedin;
    }
};

window.enterApplication = function (userType = 'individual') {
    // Save type to identify profile routing
    window.localStorage.setItem('currentUserType', userType);

    // Update the "View Profile" dropdown link target
    const viewProfileLink = document.getElementById('dropdown-view-profile');
    if (viewProfileLink) {
        if (userType === 'company') {
            viewProfileLink.setAttribute('data-target', 'company-detail');
        } else {
            viewProfileLink.setAttribute('data-target', 'profile');
        }
    }

    // Persist state from Onboarding to Profile Tab
    window.populateProfileData();

    // Hide Auth Portal
    document.getElementById('auth-portal').style.display = 'none';

    // Show Main App
    const appContainer = document.querySelector('.app-container');
    appContainer.style.display = 'flex';
    appContainer.style.animation = 'fadeIn 0.8s ease-in-out';

    // Role-based Navigation Visibility
    const fundingNav = document.querySelector('.nav-item[data-target="funding"]');
    const servicesNav = document.querySelector('.nav-item[data-target="services"]');
    if (userType === 'individual') {
        if (fundingNav) fundingNav.style.display = 'none';
        if (servicesNav) servicesNav.style.display = 'none';
    } else {
        if (fundingNav) fundingNav.style.display = 'flex';
        if (servicesNav) servicesNav.style.display = 'flex';
    }

    // Feature Restriction: Restricted actions for Company profiles
    const restrictedButtons = document.querySelectorAll(`
        .job-card .btn-primary,
        .deal-card .btn,
        .services-layout .btn,
        #events .grid-layout .btn,
        #funding .page-header .btn,
        #services .page-header .btn,
        #events .page-header .btn
    `);

    if (userType === 'company') {
        restrictedButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.title = 'Company accounts cannot perform this action on the network.';
        });
    } else {
        restrictedButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.title = '';
        });
    }
};


window.openEditCompanyModal = function (focusField = 'all') {
    // Populate form with current values from the page
    const name = document.getElementById('comp-prof-name') ? document.getElementById('comp-prof-name').innerText : '';
    const desc = document.getElementById('comp-prof-desc') ? document.getElementById('comp-prof-desc').innerText : '';
    const industry = document.getElementById('comp-prof-industry') ? document.getElementById('comp-prof-industry').innerText : '';
    const type = document.getElementById('comp-prof-type') ? document.getElementById('comp-prof-type').innerText : '';
    const email = document.getElementById('comp-prof-email') ? document.getElementById('comp-prof-email').innerText : '';
    const gst = document.getElementById('comp-prof-gst') ? document.getElementById('comp-prof-gst').innerText : '';
    const years = document.getElementById('comp-prof-years') ? document.getElementById('comp-prof-years').innerText : '';
    const website = document.getElementById('edit-comp-website') ? document.getElementById('edit-comp-website').value : ''; // Pull from hidden input or session if needed
    const linkedin = document.getElementById('edit-comp-linkedin') ? document.getElementById('edit-comp-linkedin').value : '';

    if (document.getElementById('edit-comp-name')) document.getElementById('edit-comp-name').value = name === 'Company Name' ? '' : name;
    if (document.getElementById('edit-comp-desc')) document.getElementById('edit-comp-desc').value = (desc.includes('Add organization') || desc.includes('Company overview')) ? '' : desc;
    if (document.getElementById('edit-comp-industry')) document.getElementById('edit-comp-industry').value = (industry.includes('Add Industry') || industry === 'Industry') ? 'IT / SaaS' : industry;
    if (document.getElementById('edit-comp-type')) document.getElementById('edit-comp-type').value = (type.includes('Add Type') || type === 'Pvt Ltd') ? 'Private Limited (Pvt Ltd)' : type;
    if (document.getElementById('edit-comp-email')) document.getElementById('edit-comp-email').value = (email.includes('Add Email') || email === 'admin@company.com') ? '' : email;
    if (document.getElementById('edit-comp-gst')) document.getElementById('edit-comp-gst').value = (gst.includes('Add GST') || gst.includes('Verified')) ? '' : gst.replace('Verified', '').trim();
    if (document.getElementById('edit-comp-years')) document.getElementById('edit-comp-years').value = (years.includes('Add Years') || years === '0') ? '' : years.replace('Years', '').trim();

    // Toggle visibility of specific fields based on user request
    const groups = document.querySelectorAll('.edit-group');
    groups.forEach(g => g.style.display = 'none');

    if (focusField === 'all') {
        groups.forEach(g => g.style.display = 'block');
    } else {
        const targetGroup = document.getElementById('edit-group-' + focusField);
        if (targetGroup) {
            targetGroup.style.display = 'block';
            // Auto focus the input if it's a single field
            setTimeout(() => {
                const input = targetGroup.querySelector('input, textarea, select');
                if (input) input.focus();
            }, 10);
        }
    }

    window.switchCreateView('edit-company');
    document.getElementById('create-modal').classList.add('active');
};

window.saveCompanyProfile = function () {
    // Get values from form
    const name = document.getElementById('edit-comp-name').value.trim();
    const desc = document.getElementById('edit-comp-desc').value.trim();
    const industry = document.getElementById('edit-comp-industry').value;
    const type = document.getElementById('edit-comp-type').value;
    const email = document.getElementById('edit-comp-email').value.trim();
    const gst = document.getElementById('edit-comp-gst').value.trim();
    const years = document.getElementById('edit-comp-years').value.trim();
    const website = document.getElementById('edit-comp-website').value.trim();
    const linkedin = document.getElementById('edit-comp-linkedin').value.trim();

    // Update Profile UI
    if (name) document.getElementById('comp-prof-name').innerText = name;

    const descEl = document.getElementById('comp-prof-desc');
    if (desc) descEl.innerText = desc;
    else descEl.innerHTML = '<i class="ph ph-plus-circle"></i> Add organization overview and short description...';

    if (industry) document.getElementById('comp-prof-industry').innerText = industry;

    const typeEl = document.getElementById('comp-prof-type');
    if (type) typeEl.innerText = type.replace(' (Pvt Ltd)', '');
    else typeEl.innerHTML = '<i class="ph-fill ph-plus-circle"></i> Add Type';

    const emailEl = document.getElementById('comp-prof-email');
    if (email) emailEl.innerText = email;
    else emailEl.innerHTML = '<i class="ph-fill ph-plus-circle"></i> Add Email';

    const gstEl = document.getElementById('comp-prof-gst');
    if (gst) gstEl.innerHTML = `<i class="ph-fill ph-shield-check"></i> ${gst}`;
    else gstEl.innerHTML = '<i class="ph-fill ph-plus-circle"></i> Add GST';

    const yearsEl = document.getElementById('comp-prof-years');
    if (years) yearsEl.innerText = years;
    else yearsEl.innerText = 'Add Years';

    if (website) {
        document.getElementById('comp-prof-website').innerText = 'Visit Website';
        document.getElementById('comp-prof-website-link').href = website.startsWith('http') ? website : 'https://' + website;
    } else {
        document.getElementById('comp-prof-website').innerText = 'Visit Website';
        document.getElementById('comp-prof-website-link').href = '#';
    }

    if (linkedin) {
        document.getElementById('comp-prof-linkedin').innerText = 'Visit LinkedIn';
        document.getElementById('comp-prof-linkedin-link').href = linkedin.startsWith('http') ? linkedin : 'https://' + linkedin;
    } else {
        document.getElementById('comp-prof-linkedin').innerText = 'Visit LinkedIn';
        document.getElementById('comp-prof-linkedin-link').href = '#';
    }

    // Persist to session (simulation)
    localStorage.setItem('comp_profile_updated', 'true');

    window.closeModal();
    alert('Company profile updated successfully!');
};

// ==========================================
// RENDER POSTGRESQL NATIVE API INTEGRATION
// ==========================================

// Global render function
window.loadLiveFeed = async function() {
    const feedContainer = document.getElementById('home');
    if(!feedContainer) return;

    try {
        const res = await fetch('http://127.0.0.1:5000/api/feed');
        const data = await res.json();
        
        if(data.success) {
            // Find the "Latest in Network" span and inject dynamic posts right under it, wiping old hardcoded posts.
            // For safety, we will just create a dedicated container or append.
            let dynamicFeed = document.getElementById('dynamic-sql-feed');
            if(!dynamicFeed) {
                dynamicFeed = document.createElement('div');
                dynamicFeed.id = 'dynamic-sql-feed';
                
                // Remove hardcoded cards
                const staticCards = feedContainer.querySelectorAll('.card.margin-bottom');
                staticCards.forEach(card => {
                    // keep only the create-post card
                    if(!card.querySelector('.create-post-actions')) {
                        card.remove(); 
                    }
                });

                feedContainer.appendChild(dynamicFeed);
            }

            dynamicFeed.innerHTML = ''; // clear

            if(data.data.length === 0) {
                 dynamicFeed.innerHTML = '<div style="text-align:center; color:#94A3B8; padding:30px;">No posts in the SQL database yet. Create one!</div>';
            }

            data.data.forEach(post => {
                dynamicFeed.innerHTML += `
                <div class="card margin-bottom fade-in">
                    <div class="user-meta" style="margin-bottom:12px;">
                        <div class="avatar"><i class="ph-fill ph-user-circle"></i></div>
                        <div class="meta-info">
                            <h4 class="name">${post.author_name}</h4>
                            <p class="role">${post.author_role} • ${post.date}</p>
                        </div>
                    </div>
                    <p style="font-size:14px; line-height:1.6; color:#1E293B; margin-bottom:16px;">${post.content}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #E2E8F0; padding-top:12px;">
                        <button class="btn btn-outline" style="border:none; color:#64748B;"><i class="ph ph-heart"></i> ${post.likes_count}</button>
                        <button class="btn btn-outline" style="border:none; color:#64748B;"><i class="ph ph-chat-circle"></i> ${post.comments_count} cmts</button>
                    </div>
                </div>
                `;
            });
        }
    } catch (err) {
        console.error("API Connection dropped:", err);
    }
};

window.submitLivePost = async function() {
    const inputArea = document.getElementById('create-post-textarea');
    if(!inputArea || !inputArea.value.trim()) return;

    const content = inputArea.value.trim();
    const btn = document.getElementById('btn-create-post-sql');
    if(btn) {
        btn.disabled = true;
        btn.innerHTML = 'Pushing to DB...';
    }

    try {
        const payload = {
            email: localStorage.getItem('emailForSignIn') || 'user@host.com',
            name: userType === 'company' ? 'Verified Workspace' : 'Professional Account',
            role: userType === 'company' ? 'Enterprise Node' : 'Registered User',
            content: content
        };

        const res = await fetch('http://127.0.0.1:5000/api/feed', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if(data.success) {
            inputArea.value = '';
            closeModal(); // Hide modal when post goes live
            loadLiveFeed(); // Refresh
        } else {
            alert('Failed to insert into live SQL.');
        }
    } catch(err) {
        console.error(err);
        alert('Server connection error.');
    }

    if(btn) {
        btn.disabled = false;
        btn.innerHTML = 'Publish Feed';
    }
};

// Initial DB Sync Trigger
document.addEventListener('DOMContentLoaded', () => {
    // Add logic to trigger loadLiveFeed when 'home' tab opens, or immediately if we are on 'home'
    setTimeout(loadLiveFeed, 500);
});
