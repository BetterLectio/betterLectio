import { DateTime } from "luxon";

export const LECTIO_API_URL = 'https://api.betterlectio.dk';

export const convertLectioTime = (dateString: string) => {
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
    startDate = startDate.setZone('Europe/Copenhagen'); // utc+1
    endDate = endDate.setZone('Europe/Copenhagen'); // utc+1

    //minus 2 hours from the start and end date
    startDate = startDate.minus({ hours: 2 });
    endDate = endDate.minus({ hours: 2 });

    const formattedStartDate = startDate.toISO();
    const formattedEndDate = endDate.toISO();
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