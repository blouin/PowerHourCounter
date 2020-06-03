export const sortPlayers = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
  
    let comparison = 0;
    if (nameA > nameB) {
        comparison = 1;
    } 
    else if (nameA < nameB) {
        comparison = -1;
    }

    return comparison;
}

export const sortHistory = (a, b) => {
    const dateA = a.date.toUpperCase();
    const dateB = b.date.toUpperCase();

    let comparison = 0;
    if (dateA < dateB) {
        comparison = 1;
    }
    else if (dateA > dateB) {
        comparison = -1;
    }

    return comparison;
}