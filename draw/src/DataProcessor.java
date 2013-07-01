import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import model.DataRecord;

/**
 * Class for processing call process() to process data.
 * 
 * @author yuccai
 * 
 */
public class DataProcessor {
	private static final int BREATHING_TYPE = 0x21;
	private static final int ECG1_TYPE = 0x22;
	private static final int ECG2_TYPE = 0x23;
	private static final int ECG3_TYPE = 0x24;
	private static final int OTHERS_TYPE = 0x25;

	private float[] ecg; // all ecg data in one package
	private int ecgLength = 0; // ecg data length

	Map<Integer, DataRecord> _records = new HashMap<Integer, DataRecord>();

	/**
	 * Processing data
	 * 
	 * @param data
	 *            data in one package
	 * @param len
	 *            data length
	 */
	public void process(byte[] data, int len) {
		splitData(data, len);
		mergeECGData();
		outputECGChart();
	}

	private void splitData(byte[] data, int len) {
		int i = 0;
		while (i < len) {
			if ((data[i] & 0xff) == 0xaa && (data[i + 1] & 0xff) == 0xaa
					&& (data[i + 2] & 0xff) == 0xaa) {
				i = createSectionRecord(data, i);
			}
			i++;
		}
	}

	private void mergeECGData() {
		int allECGDataLength = 10 * 3 * _records.size();
		ecg = new float[allECGDataLength];

		for (Map.Entry<Integer, DataRecord> entry : _records.entrySet()) {
			DataRecord record = entry.getValue();
			if (record.breathing != null && record.ecg1 != null
					&& record.ecg2 != null && record.ecg3 != null) {
				for (int i = 0; i < record.ecg1.length; i += 4) {
					ecg[ecgLength++] = bytes4ToFloat(record.ecg1, i);
				}
				for (int i = 0; i < record.ecg2.length; i += 4) {
					ecg[ecgLength++] = bytes4ToFloat(record.ecg2, i);
				}
				for (int i = 0; i < record.ecg3.length; i += 4) {
					ecg[ecgLength++] = bytes4ToFloat(record.ecg3, i);
				}
				System.out.printf("%f\n", ecg[ecgLength - 1]);
			}
		}
	}

	private void outputECGChart() {
		ECGChart chart = new ECGChart();
		chart.createChart(ecg, 0, ecgLength, "./output/1.jpg");
	}

	private int createSectionRecord(byte[] data, int start) {
		int serialNumber = data[start + 3];
		int type = data[start + 4];
		int sectionLen = 0;
		switch (type & 0xff) {
		case BREATHING_TYPE:
		case ECG1_TYPE:
		case ECG2_TYPE:
		case ECG3_TYPE:
			sectionLen = 40;
			break;
		case OTHERS_TYPE:
			sectionLen = 25;
			break;
		}

		byte[] section = new byte[sectionLen];
		copyBytes(section, data, start + 5, sectionLen);
		DataRecord dr = _records.get(serialNumber);
		if (dr == null) {
			dr = new DataRecord();
			dr.serialNumber = serialNumber;
			_records.put(serialNumber, dr);
		}

		switch (type & 0xff) {
		case BREATHING_TYPE:
			dr.breathing = section;
			break;
		case ECG1_TYPE:
			dr.ecg1 = section;
			break;
		case ECG2_TYPE:
			dr.ecg2 = section;
			break;
		case ECG3_TYPE:
			dr.ecg3 = section;
			break;
		case OTHERS_TYPE:
			dr.others = section;
			break;
		}

		return start + 5 + sectionLen - 1;
	}

	private static void copyBytes(byte[] section, byte[] data, int start,
			int length) {
		for (int i = 0; i < length; i++) {
			section[i] = data[i + start];
		}
	}

/*	private static float[] byteArray2FloatArray(byte[] bytes) {
		int len = bytes.length / 4;
		float[] floats = new float[len];
		for (int i = 0; i < len; i++) {
			floats[i] = bytes4ToFloat(bytes, i * 4);
		}

		return floats;
	}*/

	private static float bytes4ToFloat(byte[] b, int index) {
		int l;
		l = b[index + 3];
		l &= 0xff;
		l |= ((long) b[index + 2] << 8);
		l &= 0xffff;
		l |= ((long) b[index + 1] << 16);
		l &= 0xffffff;
		l |= ((long) b[index + 0] << 24);
		return Float.intBitsToFloat(l);
	}

	public static void main(String[] argv) throws IOException {
		DataProcessor dp = new DataProcessor();
		@SuppressWarnings("resource")
		FileInputStream fis = new FileInputStream("./data/sample1");
		byte[] data = new byte[1000000];
		int len = fis.read(data);
		dp.process(data, len);
	}
}
