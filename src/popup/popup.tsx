import React, { useEffect, useState } from "react";
import './popup.css';
import problemToCompanyMatcher from '../../resources/company-wise-problem-list.js';
const Popup = () => {
    const [currentTabURL, setCurrentTabURL] = useState('');
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        function getCurrentTabURL() {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs.length > 0) {
                    setCurrentTabURL(tabs[0].url);
                }
            });
        }

        getCurrentTabURL();

        chrome.tabs.onActivated.addListener(getCurrentTabURL);

        return () => {
            chrome.tabs.onActivated.removeListener(getCurrentTabURL);
        };
    }, []);

    useEffect(() => {
        if (currentTabURL.includes("leetcode")) {
            const startIndex = currentTabURL.indexOf("problems/") + "problems/".length;
            const endIndex = currentTabURL.indexOf("/description");
            const extractedString = currentTabURL.substring(startIndex, endIndex);

            const companiesData = problemToCompanyMatcher["leetcode.com"][extractedString];
            if (companiesData && companiesData.length > 0) {
                const companiesArray = companiesData.map(companyData => ({
                    company: companyData.company,
                    frequency: companyData.num_occur
                }));
                setCompanies(companiesArray);
            } else {
                setCompanies([]);
            }
        } else {
            setCompanies([{ company: "No Problem Found!", frequency: 0 }]);
        }
    }, [currentTabURL]);

    return (
        <div className="bg-slate-300 p-3">
        <ul>
            {companies.map((companyData, index) => (
                <li key={index} className="text-sm inline-block rounded-full text-white bg-gray-800 px-4 py-2 mr-2 mb-2 hover:bg-gray-600 cursor-pointer">
                    {companyData.company} <span><strong>{companyData.frequency}</strong></span>
                </li>
            ))}
        </ul>
    </div>
    )
};

export default Popup;
