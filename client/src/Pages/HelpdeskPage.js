import React, { useEffect, useState } from 'react'

const HelpdeskPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('https://fixxer-api.vercel.app/contact');
                const data = await response.json();
                setReports(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    function handleDelete(id) {
        fetch(`https://fixxer-api.vercel.app/contact/${id}`, {
            method: 'DELETE',
        }).then(() => {
            setReports(reports.filter(report => report._id !== id));
        });
    }

    return (
        <div className="report-container">
            <h2>Raporlar</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="report-list">
                    {reports.length === 0 ? (
                        <p>Henüz rapor yok.</p>
                    ) : (
                        reports.map((report, index) => (
                            <div key={index} className="report-item">
                                <p><strong>Adı:</strong> {report.name}</p>
                                <a href={`mailto:${report.email}`}><strong>E-posta:</strong> {report.email}</a>
                                <p><strong>Mesaj:</strong> {report.message}</p>
                                <p><strong>Tarih:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                                <button onClick={() => handleDelete(report._id)}>Sil</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default HelpdeskPage