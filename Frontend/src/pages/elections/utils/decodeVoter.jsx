export const decodeVoterEmail = (email) => {
    const regex = /^(phd|mt|b?([a-z]+|\d{2}))(\d{2})(\d+)@iiti\.ac\.in$/;
    const match = email.match(regex);
    
    if (!match) return { error: "Invalid IIT Indore email format" };
    
    const [_, prefix, branchOrBatch, year, rollNo] = match;
    const currentYear = new Date().getFullYear() % 100; // Extract last two digits of current year
    
    // Year is based on the first two digits of the roll number
    const entryYear = parseInt(year, 10);
    
    // Calculate academic year directly from entry year
    // If entry year is 22, they're in 3rd year; if 21, they're in 4th year, etc.
    const academicYear = currentYear - entryYear ;
    
    const degreeMap = {
        'phd': { name: 'PhD', duration: 5 },
        'mt': { name: 'MTech', duration: 2 },
        'b': { name: 'BTech', duration: 4 }
    };
    
    const branchMap = {
        '01': 'CSE', '02': 'EE', '03': 'ME', '04': 'CIVIL', '05': 'MEMS',
        'cse': 'CSE', 'ee': 'EE', 'me': 'ME', 'civil': 'CIVIL', 'mems': 'MEMS'
    };
    
    let degree, branch;
    
    // Determine degree and branch based on prefix
    if (prefix === 'phd') {
        degree = 'PhD';
        branch = null; // No specific branch for PhD
    } else if (prefix === 'mt') {
        degree = 'MTech';
        branch = null; // No specific branch for MTech
    } else if (prefix.startsWith('b') || /^\d{2}$/.test(branchOrBatch)) {
        degree = 'BTech';
        branch = branchMap[branchOrBatch] || 'Unknown Branch';
    } else {
        // Default case - BTech with branch determined by first characters
        degree = 'BTech';
        branch = branchMap[prefix] || 'Unknown Branch';
    }
    
    // Calculate academic year status
    let status;
    const yearSuffix = (year) => {
        if (year === 1) return "1st Year";
        if (year === 2) return "2nd Year";
        if (year === 3) return "3rd Year";
        return `${year}th Year`;  // Covers 4th Year, 5th Year, etc.
    };
    
    if (degree === "PhD") {
        status = academicYear > 5 ? "5+ Year" : yearSuffix(academicYear);
    } else {
        const maxYears = degree === "BTech" ? 4 : 2; // BTech is 4 years, MTech is 2
        status = academicYear > maxYears ? "Alumni" : yearSuffix(academicYear);
    }
    
    return {
        email,
        degree,
        branch,
        status,
        rollNo: year + rollNo // Complete roll number including year
    };
};