import { DateTime } from "luxon";

export const LECTIO_API_URL = 'https://api.bedstelectio.dk';

export const convertLectioExamName = (name: string) => {
    return name.replace('mdt.', 'mundtlig').replace('skr.', 'skriftlig')
        .replace('prv.', 'prøve')
        .replace('eks.', 'eksamen')
}

export const convertLectioTime = (dateString: string) => {
    const matchArray = dateString.match(/\d+/gu);
    if (matchArray === null) {
        throw new Error('Invalid date string');
    }
    const [day, month, year, hour, minute] = matchArray;
    return DateTime.local(
        Number(year),
        Number(month),
        Number(day),
        Number(hour),
        Number(minute)
    ).setZone('Europe/Copenhagen').minus({ hours: 2 });
}

export const convertLectioInterval = (dateString: string) => {
    const [startDateString, endDateString] = dateString.split(' til ');
    const matchArray = startDateString.match(/\d+/gu);
    if (matchArray === null) {
        throw new Error('Invalid date string');
    }
    const [startDay, startMonth, startYear, startHour, startMinute] = matchArray;
    const endMatchArray = endDateString.match(/\d+/gu);
    if (endMatchArray === null) {
        throw new Error('Invalid date string');
    }
    const [endHour, endMinute] = endMatchArray;

    let startDate = DateTime.local(
        Number(startYear),
        Number(startMonth),
        Number(startDay),
        Number(startHour),
        Number(startMinute)
    );

    let endDate = DateTime.local(
        Number(startYear),
        Number(startMonth),
        Number(startDay),
        Number(endHour),
        Number(endMinute)
    );

    //set the start and the end date to the copenhagen timezone
    startDate = startDate.setZone('Europe/Copenhagen'); // CET/CEST
    endDate = endDate.setZone('Europe/Copenhagen'); // CET/CEST

    const formattedStartDate = startDate.minus({ hours: 2 }).toISO();
    const formattedEndDate = endDate.minus({ hours: 2 }).toISO();
    return [formattedStartDate, formattedEndDate];
}

export const checkLectioCookie = async (cookie: string): Promise<boolean> => {
    const lectioResponse = await fetch(LECTIO_API_URL + '/check-cookie', {
        headers: {
            'lectio-cookie': String(cookie)
        }
    });

    let json = await lectioResponse.json();
    if (json.valid == false) return false;
    return true;
}