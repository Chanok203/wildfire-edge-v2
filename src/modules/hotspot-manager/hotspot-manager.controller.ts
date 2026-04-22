import { Request, Response } from 'express';

import { config } from '@/configs';
import { DroneService } from '@/modules/drones/drone.service';
import { HotspotManagerService } from '@/modules/hotspot-manager/hotspot-manager.service';

const entity = 'hotspot-manager';

const droneService = new DroneService();
const hotspotManagerService = new HotspotManagerService();

export const renderInstanceList = async (req: Request, res: Response) => {
    const droneList = await droneService.getDroneList();
    res.render('hotspot-manager/hotspot-manager-list.html', {
        entity,
        droneList,
    });
};

export const handleCreateInstance = async (req: Request, res: Response) => {
    const { droneId } = req.body;
    const input_url = `${config.mediamtx.rtsp}/${droneId}`;
    const output_url = `${config.mediamtx.rtsp}/AI/${droneId}`;
    const created = await hotspotManagerService.create(
        droneId,
        input_url,
        output_url,
    );
    if (created) {
        req.flash('success', `คุณสร้างตัวตรวจจับหัวไฟสำเร็จ (${droneId})`);
    } else {
        req.flash('danger', `คุณสร้างตัวตรวจจับหัวไฟไม่สำเร็จ (${droneId})`);
    }
    res.redirect('/hotspot-manager/');
};

export const renderInstancePlayer = async (req: Request, res: Response) => {
    const { droneId } = req.params;

    res.render('hotspot-manager/hotspot-manager-player.html', {
        entity,
        droneId,
        src: `http://${config.app.publicIp}:8889/AI/${droneId}`,
    });
};

export const handleDeleteInstance = async (req: Request, res: Response) => {
    const droneId = req.params.droneId as string;
    const deleted = await hotspotManagerService.deleteById(droneId);
    if (deleted) {
        req.flash('success', `คุณลบตัวตรวจจับหัวไฟแล้ว (${droneId})`);
    } else {
        req.flash('danger', `คุณลบตัวตรวจจับหัวไฟไม่สำเร็จ (${droneId})`);
    }
    res.redirect('/hotspot-manager/');
};

export const handleDeleteAllInstances = async (req: Request, res: Response) => {
    const deleted = await hotspotManagerService.deleteAll();
    if (deleted) {
        req.flash('success', 'คุณลบตัวตรวจจับหัวไฟทั้งหมดแล้ว');
    } else {
        req.flash('danger', 'คุณลบตัวตรวจจับหัวไฟไม่สำเร็จ');
    }
    res.redirect('/hotspot-manager/');
};

export const handleExtendTime = async (req: Request, res: Response) => {
    const droneId = req.params.droneId as string;
    const extended = await hotspotManagerService.extendTimeById(droneId);
    if (extended) {
        req.flash('success', `คุณต่อเวลาให้ตัวตรวจจับหัวไฟแล้ว (${droneId})`);
    } else {
        req.flash('danger', `คุณต่อเวลาให้ตัวตรวจจับหัวไฟไม่สำเร็จ (${droneId})`);
    }
    res.redirect('/hotspot-manager/');
};
