const Dashboard = () => {
    const summary = [
        {
            label: "Total Applicants",
            value: 0,
        },
        {
            label: "Active Job Openings",
            value: 0,
        },
        {
            label: "Pending Applications",
            value: 0,
        },
        {
            label: "Shortlisted Applicants",
            value: 0,
        },
        {
            label: "Applicants for Interview",
            value: 0,
        },
        {
            label: "Applicants for Processing",
            value: 0,
        },
        {
            label: "Deployed Applicants",
            value: 0,
        },
    ];

    return (
        <section>
            <div className="dashboard-summary">
                {summary.map((item) => (
                    <div key={item.label} className="summary-card">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Dashboard;
