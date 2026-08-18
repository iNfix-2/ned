/* ==========================================================================
   NetHawk Solutions - Interactive VectorNav Scripting & Telemetry Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Toggle
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileClose = document.getElementById('mobileClose');

    if (burgerBtn && mobileDrawer) {
        burgerBtn.addEventListener('click', () => {
            mobileDrawer.classList.add('active');
        });
    }

    if (mobileClose && mobileDrawer) {
        mobileClose.addEventListener('click', () => {
            mobileDrawer.classList.remove('active');
        });
    }

    // 2. Sticky Header Scroll FX
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // 3. VectorNav Product Matrix Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. Industry Tab Stage Switcher
    const industryTabs = document.querySelectorAll('.tab-btn');
    const industryData = {
        defense: {
            title: "DEFENSE & TACTICAL RECONNAISSANCE",
            desc: "Long-range BVLOS stealth reconnaissance, tactical UAV payload delivery, encrypted video links, and military-grade perimeter surveillance.",
            img: "assets/images/defense_aerial_surveillance_1786471649931.png"
        },
        hydro: {
            title: "HYDROELECTRIC & ENERGY DAMS",
            desc: "Autonomous structural inspection, automated perimeter patrols, thermal anomaly detection, and real-time threat alert systems.",
            img: "assets/images/dam_hydroelectric_facility_1786471617482.png"
        },
        oil: {
            title: "OIL & GAS PIPELINE SECURITY",
            desc: "High-endurance aerial sweeps across remote oil pipelines, intrusion detection, leak tracking, and automated emergency alert dispatches.",
            img: "assets/images/oil_gas_pipeline_security_1786471633512.png"
        },
        corporate: {
            title: "CORPORATE ASSET & VIP PROTECTION",
            desc: "Discreet tactical ground security teams, armed convoy escort services, VIP aerial shadow protection, and secure compound access management.",
            img: "assets/images/executive_vip_convoy_1786471661661.png"
        }
    };

    const stageTitle = document.getElementById('stageTitle');
    const stageDesc = document.getElementById('stageDesc');
    const stageImg = document.getElementById('stageImg');

    industryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            industryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetKey = tab.getAttribute('data-tab');
            if (industryData[targetKey] && stageTitle && stageDesc && stageImg) {
                stageTitle.textContent = industryData[targetKey].title;
                stageDesc.textContent = industryData[targetKey].desc;
                stageImg.src = industryData[targetKey].img;
            }
        });
    });

    // 5. Live HUD Telemetry Real-time Simulator
    const hudAlt = document.getElementById('hudAlt');
    const hudSpeed = document.getElementById('hudSpeed');
    const hudHdg = document.getElementById('hudHdg');
    const hudLat = document.getElementById('hudLat');
    const hudLon = document.getElementById('hudLon');

    if (hudAlt && hudSpeed && hudHdg) {
        setInterval(() => {
            // Subtle telemetry oscillations
            const baseAlt = 485;
            const newAlt = (baseAlt + (Math.random() * 4 - 2)).toFixed(1);
            hudAlt.textContent = `${newAlt} M`;

            const baseSpd = 68.4;
            const newSpd = (baseSpd + (Math.random() * 1.5 - 0.75)).toFixed(1);
            hudSpeed.textContent = `${newSpd} KM/H`;

            const baseHdg = 42;
            const newHdg = Math.floor(baseHdg + (Math.random() * 2 - 1));
            hudHdg.textContent = `${String(newHdg).padStart(3, '0')}°`;
        }, 1500);
    }
});
